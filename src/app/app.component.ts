import {
  AfterContentInit,
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
import { Subject, switchMap, takeUntil } from 'rxjs';
import { BinanceStreamService } from './core/services/binance-stream.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'trading-view';
  @ViewChild('tradingView') tradingViewEleRef?: ElementRef<HTMLElement>;
  private candlestickSeries?: ISeriesApi<'Candlestick'>;
  private kData: CandlestickData[] = [];
  private resetLastKData = false;
  private destroy$ = new Subject();
  constructor(private binanceStream: BinanceStreamService) {}

  ngOnInit(): void {
    this.binanceStream
      .getOldKline('BTCUSDT', '1h')
      .pipe(
        takeUntil(this.destroy$),
        switchMap((oldData) => {
          const data: CandlestickData[] = oldData.map((item) => ({
            time: (item[0] / 1000) as UTCTimestamp,
            open: parseFloat(item[1]),
            close: parseFloat(item[4]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
          }));
          this.kData.push(...data);
          return this.binanceStream.connectWebsocket('btcusdt', '1h');
        })
      )
      .subscribe((data) => {
        const _kData = {
          time: (data.E / 1000) as UTCTimestamp,
          open: parseFloat(data.k.o),
          close: parseFloat(data.k.c),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
        };
        this.kData[this.kData.length - 1] = _kData;
        if (this.candlestickSeries) {
          this.candlestickSeries.setData(this.kData);
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.tradingViewEleRef) {
      const chart = createChart(this.tradingViewEleRef.nativeElement, {
        width: 600,
        height: 400,
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      });
      this.candlestickSeries = chart.addCandlestickSeries();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
