import yfinance as yf

from models import Portfolio
from collections import defaultdict

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

        holdings_data = []

        # -----------------------------
        # Build holding data
        # -----------------------------
        for holding in portfolio.holdings:

            quote = MarketService.get_quote(holding.ticker)

            if not quote["success"]:
                continue

            investment = holding.quantity * holding.purchase_price
            current_value = holding.quantity * quote["price"]

            profit = current_value - investment

            profit_percent = (
                (profit / investment) * 100
                if investment > 0 else 0
            )

            holdings_data.append({

                "id": holding.id,

                "ticker": holding.ticker,

                "company": quote["company"],

                "asset_type": holding.asset_type,

                "quantity": holding.quantity,

                "purchase_price": holding.purchase_price,

                "purchase_date": holding.purchase_date.isoformat(),

                "current_price": quote["price"],

                "investment": round(investment, 2),

                "current_value": round(current_value, 2),

                "profit": round(profit, 2),

                "profit_percent": round(profit_percent, 2),

                "change": quote["change"],

                "change_percent": quote["change_percent"],

                "currency": quote["currency"]

            })

        # -----------------------------
        # Portfolio Summary
        # -----------------------------
        total_investment = round(
            sum(h["investment"] for h in holdings_data),
            2
        )

        current_value = round(
            sum(h["current_value"] for h in holdings_data),
            2
        )

        total_profit = round(
            current_value - total_investment,
            2
        )

        profit_percent = round(
            (total_profit / total_investment) * 100,
            2
        ) if total_investment > 0 else 0

        # -----------------------------
        # Analytics
        # -----------------------------
        asset_allocation = defaultdict(float)

        holding_allocation = []

        for holding in holdings_data:

            asset_allocation[
                holding["asset_type"]
            ] += holding["current_value"]

            holding_allocation.append({

                "ticker": holding["ticker"],

                "company": holding["company"],

                "value": holding["current_value"]

            })

        holding_allocation.sort(
            key=lambda x: x["value"],
            reverse=True
        )

        sorted_profit = sorted(
            holdings_data,
            key=lambda x: x["profit"],
            reverse=True
        )

        top_gainers = [

            {

                "ticker": h["ticker"],

                "company": h["company"],

                "profit": h["profit"]

            }

            for h in sorted_profit[:5]

        ]

        top_losers = [

            {

                "ticker": h["ticker"],

                "company": h["company"],

                "profit": h["profit"]

            }

            for h in sorted_profit[-5:]

        ]

        # -----------------------------
        # Final Response
        # -----------------------------
        return {

            "success": True,

            "portfolio_id": portfolio.id,

            "portfolio_name": portfolio.name,

            "summary": {

                "total_holdings": len(holdings_data),

                "total_investment": total_investment,

                "current_value": current_value,

                "profit": total_profit,

                "profit_percent": profit_percent

            },

            "analytics": {

                "asset_allocation": [

                    {

                        "asset_type": asset,

                        "value": round(value, 2)

                    }

                    for asset, value in asset_allocation.items()

                ],

                "holding_allocation": holding_allocation,

                "top_gainers": top_gainers,

                "top_losers": top_losers

            },

            "holdings": holdings_data

        }
