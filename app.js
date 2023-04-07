// I am learning ALPACA Trade API. Use developer training documents.

const Alpaca = require('@alpacahq/alpaca-trade-api');
//const API_KEY = 'enter api key';
//const API_SECRET = 'enter api secret';
const USE_POLYGON = false;// Not using POLYGON Data stream. May use this in future.Instead use Alpaca API.

const ONE_MINUTE = 60000;
const SideType = { BUY: 'buy', SELL: 'sell' };
