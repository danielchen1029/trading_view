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
import { ExchangeInfo } from '../models/exchange-info.model';

@Injectable({
  providedIn: 'root',
})
export class ApiBinanceService {
  private baseUrl = 'https://api3.binance.com';
  constructor(private http: HttpClient) {}

  exchangeInfo(): Observable<ExchangeInfo> {
    return this.http.get<ExchangeInfo>(`${this.baseUrl}/api/v3/exchangeInfo`);
  }

  /**
   * @param symbol ex. btcusdt
   * @param interval ex. 1h
   */
  connectWebsocket(
    symbol: string,
    interval: string
  ): WebSocketSubject<KLineTrade> {
    return webSocket<KLineTrade>({
      url: `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`,
    });
  }

  getOldKline(symbol: string, interval: string): Observable<any[][]> {
    const httpParams = new HttpParams()
      .append('symbol', symbol.toUpperCase())
      .append('interval', interval);
    return this.http.get<any[][]>(`${this.baseUrl}/api/v3/klines`, {
      params: httpParams,
    });
  }
}
