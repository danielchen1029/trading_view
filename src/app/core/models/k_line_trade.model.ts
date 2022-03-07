import { UTCTimestamp } from "lightweight-charts";

export interface KLineTrade {
  /**
   * @description Event type
   */
  e: string;
  /**
   * @description Event Time
   */
  E: number;
  /**
   * @description Symbol
   */
  s: string;
  k: {
    /**
     * Kline open time
     */
    t: number;
    /**
     * Kline close time
     */
    T: number;
    /**
     * @description Symbol
     */
    s: string;
    /**
     * Interval
     */
    i: string;
    /**
     * @description First trade Id
     */
    f: number;
    /**
     * Last trade Id
     */
    L: number;
    /**
     * @description Open Price
     */
    o: string;
    /**
     * @description Close Price
     */
    c: string;
    /**
     * @description High Price
     */
    h: string;
    /**
     * @description Low Price
     */
    l: string;
    /**
     * @description Base asset volume
     */
    v: string;
    /**
     * @description Number of trades
     */
    n: number;
    /**
     * @description
     */
    x: boolean;
    /**
     * @description Quote asset volume
     */
    q: string;
    /**
     * @description Taker buy base asset volume
     */
    V: string;
    /**
     * @description Taker buy quote asset volume
     */
    Q: string;
    /**
     * @description Ignore
     */
    B: string;
  }
}