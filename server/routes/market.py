from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from services.market_service import MarketService

bp = Blueprint(
    "market",
    __name__,
    url_prefix="/market"
)


@bp.route("/<string:ticker>", methods=["GET"])
@jwt_required()
def get_market_data(ticker):

    data = MarketService.get_quote(
        ticker.upper().strip()
    )

    if not data["success"]:
        return jsonify(data), 404

    return jsonify(data), 200