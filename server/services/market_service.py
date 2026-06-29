import yfinance as yf


class MarketService:

    @staticmethod
    def get_quote(ticker):

        try:

            stock = yf.Ticker(ticker)

            info = stock.info

            current_price = info.get("currentPrice")

            if current_price is None:
                current_price = info.get("regularMarketPrice")

            previous_close = info.get("previousClose")

            if previous_close is None:
                previous_close = current_price

            change = current_price - previous_close

            change_percent = 0

            if previous_close:
                change_percent = (
                    change / previous_close
                ) * 100

            return {

                "success": True,

                "ticker": ticker.upper(),

                "company": info.get("longName"),

                "exchange": info.get("exchange"),

                "currency": info.get("currency"),

                "price": round(current_price, 2),

                "previous_close": round(previous_close, 2),

                "change": round(change, 2),

                "change_percent": round(
                    change_percent,
                    2
                ),

            }

        except Exception as e:

            return {

                "success": False,

                "message": str(e)

            }