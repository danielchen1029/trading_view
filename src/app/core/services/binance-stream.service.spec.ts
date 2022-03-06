import { TestBed } from '@angular/core/testing';

import { BinanceStreamService } from './binance-stream.service';

describe('BinanceStreamService', () => {
  let service: BinanceStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
