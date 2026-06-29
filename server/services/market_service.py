import yfinance as yf

from models import Portfolio

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
        


    @staticmethod
    def get_portfolio_summary(portfolio_id):

        portfolio = Portfolio.query.get(portfolio_id)

        if portfolio is None:
            return {
                "success": False,
                "message": "Portfolio not found"
            }

        summary = []

        for holding in portfolio.holdings:

            quote = MarketService.get_quote(
                holding.ticker
            )

            if not quote["success"]:
                continue

            investment = (
                holding.quantity *
                holding.purchase_price
            )

            current_value = (
                holding.quantity *
                quote["price"]
            )

            profit = current_value - investment

            profit_percent = 0

            if investment > 0:
                profit_percent = (
                    profit / investment
                ) * 100

            total_investment = round(
                    sum(h["investment"] for h in summary),
                    2
                )

            current_value = round(
                    sum(h["current_value"] for h in summary),
                    2
                )

            profit = round(
                    current_value - total_investment,
                    2
                )

            profit_percent = 0

            if total_investment > 0:
                    profit_percent = round(
                        (profit / total_investment) * 100,
                        2
                    )

            total_holdings = len(summary)

            summary.append({

                "id": holding.id,

                "ticker": holding.ticker,

                "company": quote["company"],

                "asset_type": holding.asset_type,

                "quantity": holding.quantity,

                "purchase_price": holding.purchase_price,

                "purchase_date": holding.purchase_date,

                "current_price": quote["price"],

                "current_value": round(
                    current_value,
                    2
                ),

                "investment": round(
                    investment,
                    2
                ),

                "profit": round(
                    profit,
                    2
                ),

                "profit_percent": round(
                    profit_percent,
                    2
                ),

                "change": quote["change"],

                "change_percent": quote[
                    "change_percent"
                ],

                "currency": quote["currency"]


            })

        return {

            "success": True,

            "portfolio_id": portfolio.id,

            "portfolio_name": portfolio.name,

            "summary": {

                "total_holdings": total_holdings,

                "total_investment": total_investment,

                "current_value": current_value,

                "profit": profit,

                "profit_percent": profit_percent

            },

            "holdings": summary

        }
