import { Symbol } from "./symbol.model";

export interface ExchangeInfo {
  serverTime: number;
  symbols: Symbol[];
}