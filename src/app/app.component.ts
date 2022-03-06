import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { Subject, takeUntil } from 'rxjs';
import { BinanceStreamService } from './core/services/binance-stream.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'trading-view';
  @ViewChild('tradingView') tradingViewEleRef?: ElementRef<HTMLElement>;

  private destroy$ = new Subject();
  constructor(private binanceStream: BinanceStreamService) {}

  ngOnInit(): void {
    this.binanceStream
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log(data)
      });
  }

  ngAfterViewInit(): void {
    if (this.tradingViewEleRef) {
      console.log(this.tradingViewEleRef);
      const chart = createChart(this.tradingViewEleRef.nativeElement, {
        width: 500,
        height: 500,
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      });
      const lineSeries = chart.addCandlestickSeries();
      lineSeries.setData([
        {
          time: '2018-10-19',
          open: 54.62,
          high: 55.5,
          low: 54.52,
          close: 54.9,
        },
        {
          time: '2018-10-22',
          open: 55.08,
          high: 55.27,
          low: 54.61,
          close: 54.98,
        },
        {
          time: '2018-10-23',
          open: 56.09,
          high: 57.47,
          low: 56.09,
          close: 57.21,
        },
        {
          time: '2018-10-24',
          open: 57.0,
          high: 58.44,
          low: 56.41,
          close: 57.42,
        },
        {
          time: '2018-10-25',
          open: 57.46,
          high: 57.63,
          low: 56.17,
          close: 56.43,
        },
        {
          time: '2018-10-26',
          open: 56.26,
          high: 56.62,
          low: 55.19,
          close: 55.51,
        },
        {
          time: '2018-10-29',
          open: 55.81,
          high: 57.15,
          low: 55.72,
          close: 56.48,
        },
        {
          time: '2018-10-30',
          open: 56.92,
          high: 58.8,
          low: 56.92,
          close: 58.18,
        },
        {
          time: '2018-10-31',
          open: 58.32,
          high: 58.32,
          low: 56.76,
          close: 57.09,
        },
      ]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
