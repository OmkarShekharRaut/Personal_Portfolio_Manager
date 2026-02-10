from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("holdings", __name__, url_prefix="/holdings")


# Dummy
@bp.route("/", methods=["GET"])
@jwt_required()
def getDummyHoldings():
    return jsonify(
        [
            {
                "id": 1,
                "type": "share",
                "name": "TCS",
                "quantity": 10,
                "buy_price": 3500,
            },
            {
                "id": 2,
                "type": "mutual_fund",
                "name": "Nifty 50 Index Fund",
                "quantity": 5,
                "buy_price": 2000,
            },
        ]
    )
