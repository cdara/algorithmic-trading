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
        let stocks = ['AAPL','MSFT','GOOGL','AMZN','BRK.B','NVDA',
        'TSLA','META','JNJ','UNH','V','XOM','TSM','WMT','JPM','PG',
        'NVO','LLY','MA','CVX','HD','MRK','ABBV','KO','BABA','AVGO',
        'ASML','ORCL','PEP','PFE','AZN','BAC','TMO','COST','BHP',
        'CSCO','SHEL','MCD','NVS','CRM','NKE','TM','DIS','TMUS',
        'ABT','DHR','ACN','LIN','ADBE','VZ','UPS','TXN','CMCSA',
        'NEE','TTE','PM','NFLX','SAP','AMD','BMY','FMX','RTX','WFC',
        'MS','T','HSBC','SNY','QCOM','INTC','UL','AMGN'];

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
        var spin = setInterval(async() => {})
    }

}

