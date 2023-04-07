# algorithmic trading
 Algorithmic trading Long-Short; node.js;

# API - Alpaca
Alpaca’s paper trading API simulates the live trading API in a paper environment so we don’t have to worry about trading with real money when testing a strategy.

To get access to the paper trading API, sign up. Once you’ve signed up, you should now have access to the Alpaca paper trading dashboard, which allows you to monitor your paper trading and gives you the access keys to link your script to your account.

# The Strategy

The example strategy I will be implementing in this script is the Long-Short equity strategy. The idea behind this strategy is to rank a group of stocks from better performing to worse performing stocks, then to long the top stocks in the list and short the bottom ones. By doing this, the algorithm takes maximizes potential gains by longing what it predicts are going to be the better performing stocks, and shorting the predicted worse performing stocks.

The driving force behind success, though, is how the stocks are ranked. The ranking can make or break your algorithm. If your ranking system is good, ideally you’ll be longing stocks that are green the following days and shorting ones that aren’t doing so well. However, a bad ranking system could see your algorithm longing poorly performing stocks and, perhaps more dangerously, shorting high performing stocks, which could cause your algorithm to quickly lose you money.
