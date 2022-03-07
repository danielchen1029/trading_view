import { Injectable } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  map,
  Observable,
  tap,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { KLineTrade } from '../models/k_line_trade.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BinanceStreamService {
  constructor(private http: HttpClient) {}

  /**
   * @param symbol ex. btcusdt
   * @param interval ex. 1h
   */
  connectWebsocket(
    symbol: string,
    interval: string
  ): WebSocketSubject<KLineTrade> {
    return webSocket<KLineTrade>({
      url: `wss://stream.binance.com:9443/ws/${symbol}@kline_1h`,
    });
  }

  getOldKline(symbol: string, interval: string): Observable<any[][]> {
    const httpParams = new HttpParams()
      .append('symbol', symbol)
      .append('interval', interval);
    return this.http.get<any[][]>('https://api3.binance.com/api/v3/klines', {
      params: httpParams,
    });
  }
}
