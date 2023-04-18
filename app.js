// I am learning ALPACA Trade API. Use developer training documents.

const Alpaca = require('@alpacahq/alpaca-trade-api');
//const API_KEY = 'enter api key';
//const API_SECRET = 'enter api secret';
const USE_POLYGON = false;// Not using POLYGON Data stream. May use this in future.Instead use Alpaca API.

const ONE_MINUTE = 60000;
const SideType = { BUY: 'buy', SELL: 'sell' };
const PositionType = { LONG: 'long', SHORT: 'short' };

//Creating one class for learning only.
// But normally we should follow SOLID principles.

class LongShort {
    constructor({ keyId, secretKey, paper = true, bucketPct = 0.25 }) {
        this.alpaca = new Alpaca({
            keyId: keyId,
            secretKey: secretKey,
            paper: paper,
            usePolygon: USE_POLYGON
        })

        //For example: Stocks list for research
        let stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'BRK.B', 'NVDA',
            'TSLA', 'META', 'JNJ', 'UNH', 'V', 'XOM', 'TSM', 'WMT', 'JPM', 'PG',
            'NVO', 'LLY', 'MA', 'CVX', 'HD', 'MRK', 'ABBV', 'KO', 'BABA', 'AVGO',
            'ASML', 'ORCL', 'PEP', 'PFE', 'AZN', 'BAC', 'TMO', 'COST', 'BHP',
            'CSCO', 'SHEL', 'MCD', 'NVS', 'CRM', 'NKE', 'TM', 'DIS', 'TMUS',
            'ABT', 'DHR', 'ACN', 'LIN', 'ADBE', 'VZ', 'UPS', 'TXN', 'CMCSA',
            'NEE', 'TTE', 'PM', 'NFLX', 'SAP', 'AMD', 'BMY', 'FMX', 'RTX', 'WFC',
            'MS', 'T', 'HSBC', 'SNY', 'QCOM', 'INTC', 'UL', 'AMGN'];

        this.stockList = stocks.map(item => ({ name: item, pc: 0 }));

        this.long = [];
        this.short = [];
        this.qShort = null;
        this.qLong = null;
        this.adjustedQLong = null;
        this.blacklist = new Set();
        this.longAmount = 0;
        this.shortAmount = 0;
        this.timeToClose = null;
        this.bucketPct = bucketPct;
    }

    async run() {
        //First step, cancel any existing orders so they don't impact our buying power.
        await this.cancelExistingOrders();

        //Wait for the stock market to Open.
        log('Waiting for the stock market to open.-.--.-');

        await this.awaitMarketOpen();
        log('Stock Market opened!');

        //Rebalance the portfolio every minute, making necessary trades.
        var spin = setInterval(async () => {
            //Figure out when the market will close so we can prepare to sell beforehand.
            try {
                let clock = await this.alpaca.getClock();
                let closingTime = new Date(clock.next_close.substring(0, clock.next_close.length - 6));
                let currentTime = new Date(clock.timestamp.substring(0, clock.timestamp.length - 6));
                this.timeToClose = Math.abs(closingTime - currentTime);
            } catch (err) {
                log(err.error);
            }

            const INTERVAL = 15; //For minutes;

            if (this.timeToClose < (ONE_MINUTE * INTERVAL)) {
                //Close all stock positions before 15 minutes of stock market close.
                log('Stock Market Closing Soon. Now Closing All Positions.');

                try {
                    let positions = await;
                    this.alpaca.getPositions();
                    await Promise.all(positions.map(position = this.submitOrder({
                        quantity: Math.abs(position.qty),
                        stock: position.symbol,
                        side: position.side === PositionType.LONG ? SideType.SELL : SideType.BUY,
                    })));
                } catch (err) {
                    log(err.error);
                }

                clearInterval(spin);
                log(`Sleeping until stock market close (${INTERVAL} minutes).`);

                setTimeout(() => {
                    //Run script again after stock market close for next trading day
                    this.run();
                }, ONE_MINUTE * INTERVAL)
            } else {
                //Rebalance the portfolio
                await this.rebalance();
            }
        }, ONE_MINUTE);
    }

    //Spin script until the market is open
    async awaitMarketOpen() {
        return new Promise(resolve => {
            const check = async () => {
                try {
                    let clock = await this.alpaca.getClock();
                    if (clock.is_open) {
                        resolve();
                    } else {
                        let openTime = new Date(clock.next_open.substring(0, clock.next_close.length - 6));
                        let currentTime = new Date(clock.timestamp.substring(0, clock.timestamp.length - 6));
                        this.timeToClose = Math.floor((openTime - currentTime) / 1000 / 60);
                        log(`${this.timeToClose} minutes til next day market open.`);
                        setTimeout(check, ONE_MINUTE);
                    }
                } catch (err) {
                    log(err.error);
                }
            }
            check();
        })
    }

    //Cancel exsisting orders
    async cancelExistingOrders() {
        let orders;
        try {
            orders = await this.alpaca.getOrders({
                status: 'open',
                direction: 'desc'
            })
        } catch (err) {
            log(err.error);
        }
        return Promise.all(orders.map(order => {
            return new Promise(async (resolve) => {
                try {
                    await this.alpaca.cancelOrder(order.id);
                } catch { err } {
                    log(err.error);
                }
                resolve();
            })
        }))
    }

    //Rebalance our market position after an update.
    async rebalance() {
        await this.rerank();

        //Clear existing orders again.
        await this.cancelExistingOrders();

        log(`We are taking a long position in: ${this.long.toString()}`);
        log(`We are taking a short position in: ${this.short.toString()}`);

        /*Remove positions that are no longer in the short or long list,
        * and make a list of positions that do not need to change.
        * Adjust position quantities if needed.
        */
        let positions;
        try {
            positions = await this.alpaca.getPositions();
        } catch (err) {
            log(err.error);
        }

        let executed = { long: [], short: [] }
    }
}

