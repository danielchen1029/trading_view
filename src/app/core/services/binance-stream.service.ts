import { Injectable } from '@angular/core';
import { catchError, distinctUntilChanged, EMPTY, map, tap } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class BinanceStreamService {
  private socket$: WebSocketSubject<any> = webSocket<any>({
    url: 'wss://stream.binance.com:9443/ws/btcusdt@kline_1h',
  });

  constructor() {}

  getData() {
    return this.socket$;
  }
}
