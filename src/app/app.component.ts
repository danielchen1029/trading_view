import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CandlestickData,
  createChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';
import { PrimeNGConfig } from 'primeng/api';
import { iif, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { IDropdown } from './core/models/dropdown.model';
import { ApiBinanceService } from './core/services/api-binance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'trading-view';
  selectedSymbol = '';
  selectedInterval = '';
  symbols: IDropdown[] = [];
  intervals: IDropdown[] = [
    { label: '1h', value: '1h' },
    { label: '4h', value: '4h' },
    { label: '8h', value: '8h' },
    { label: '1d', value: '1d' },
  ];
  kData: CandlestickData[] = [];

  @ViewChild('tradingView') tradingViewEleRef?: ElementRef<HTMLElement>;
  private candlestickSeries?: ISeriesApi<'Candlestick'>;
  private timeLimit = 3600;
  private stream$?: Subscription;
  private destroy$ = new Subject();
  constructor(
    private binanceService: ApiBinanceService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
  }

  ngOnInit(): void {
    this.binanceService
      .exchangeInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.symbols = res.symbols.map((item) => ({
          label: item.symbol,
          value: item.symbol,
        }));
        this.selectedSymbol =
          localStorage.getItem('defaultSymbol') ?? this.symbols[0].value;
        this.selectedInterval =
          localStorage.getItem('defaultInterval') ?? this.intervals[0].value;
        this.setTimeLimit();
        this.queryOldKlineData();
      });
  }

  ngAfterViewInit(): void {
    if (this.tradingViewEleRef) {
      const chart = createChart(this.tradingViewEleRef.nativeElement, {
        width: 800,
        height: 400,
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      });
      this.candlestickSeries = chart.addCandlestickSeries();
    }
  }

  private queryOldKlineData(): void {
    this.kData = [];
    this.binanceService
      .getOldKline(this.selectedSymbol, this.selectedInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.kData = res.map((item) => ({
          time: (item[0] / 1000) as UTCTimestamp,
          open: parseFloat(item[1]),
          close: parseFloat(item[4]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
        }));
        this.drawData();
        this.storeSelection();
        this.connectStream();
      });
  }

  private connectStream(): void {
    if (this.stream$) {
      this.stream$.unsubscribe();
    }

    this.stream$ = this.binanceService
      .connectWebsocket(this.selectedSymbol, this.selectedInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.kData.length === 0) {
          return;
        }
        const data = {
          time: (res.E / 1000) as UTCTimestamp,
          open: parseFloat(res.k.o),
          close: parseFloat(res.k.c),
          high: parseFloat(res.k.h),
          low: parseFloat(res.k.l),
        };
        const t1 = data.time as number
        const t2 = this.kData[this.kData.length - 1].time as number;
        if (t1 - t2 < this.timeLimit) {
          this.kData[this.kData.length - 1] = data;
        }
        if (t1 - t2 === this.timeLimit) {
          this.kData.push(data);
        }
        this.drawData();
      });
  }

  private drawData(): void {
    if (this.candlestickSeries) {
      this.candlestickSeries.setData(this.kData);
    }
  }

  private storeSelection(): void {
    localStorage.setItem('defaultSymbol', this.selectedSymbol);
    localStorage.setItem('defaultInterval', this.selectedInterval);
  }

  private setTimeLimit(): void {
    const time = parseInt(this.selectedInterval.split('')[0], 10);
    const unit = this.selectedInterval.split('')[1];

    switch (unit) {
      case 'h':
        this.timeLimit = 3600 * time;
        break;
      case 'd':
        this.timeLimit = 3600 * 24 * time;
        break;
    }
  }

  selectionSymbol(): void {
    this.queryOldKlineData();
  }

  clickInterval(interval: IDropdown): void {
    this.selectedInterval = interval.value;
    this.setTimeLimit();
    this.queryOldKlineData();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
