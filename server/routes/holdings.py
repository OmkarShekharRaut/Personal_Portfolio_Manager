from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Portfolio, Holding

bp = Blueprint("holdings", __name__, url_prefix="/holdings")


@bp.route("/<int:portfolio_id>", methods=["GET"])
@jwt_required()
def get_holdings(portfolio_id):

    user_id = int(get_jwt_identity())

    portfolio = Portfolio.query.filter_by(
        id=portfolio_id,
        user_id=user_id
    ).first()

    if portfolio is None:
        return jsonify({"msg": "Portfolio not found"}), 404

    return jsonify([
        {
            "id": holding.id,
            "ticker": holding.ticker,
            "asset_type": holding.asset_type,
            "quantity": holding.quantity,
            "purchase_price": holding.purchase_price,
            "purchase_date": holding.purchase_date.isoformat()
        }
        for holding in portfolio.holdings
    ])


@bp.route("/<int:portfolio_id>", methods=["POST"])
@jwt_required()
def add_holding(portfolio_id):

    user_id = int(get_jwt_identity())

    portfolio = Portfolio.query.filter_by(
        id=portfolio_id,
        user_id=user_id
    ).first()

    if portfolio is None:
        return jsonify({"msg": "Portfolio not found"}), 404

    data = request.get_json()

    ticker = data.get("ticker", "").upper().strip()

    if ticker == "":
        return jsonify({"msg": "Ticker is required"}), 400

    holding = Holding(
        ticker=ticker,
        asset_type=data.get("asset_type", "Stock"),
        quantity=float(data["quantity"]),
        purchase_price=float(data["purchase_price"]),
        portfolio=portfolio
    )

    db.session.add(holding)
    db.session.commit()

    return jsonify({
        "msg": "Holding added successfully"
    }), 201


@bp.route("/<int:holding_id>", methods=["PUT"])
@jwt_required()
def update_holding(holding_id):

    user_id = int(get_jwt_identity())

    holding = (
        Holding.query
        .join(Portfolio)
        .filter(
            Holding.id == holding_id,
            Portfolio.user_id == user_id
        )
        .first()
    )

    if holding is None:
        return jsonify({"msg": "Holding not found"}), 404

    data = request.get_json()

    if "ticker" in data:
        holding.ticker = data["ticker"].upper().strip()

    if "asset_type" in data:
        holding.asset_type = data["asset_type"]

    if "quantity" in data:
        holding.quantity = float(data["quantity"])

    if "purchase_price" in data:
        holding.purchase_price = float(data["purchase_price"])

    db.session.commit()

    return jsonify({
        "msg": "Holding updated successfully"
    })


@bp.route("/<int:holding_id>", methods=["DELETE"])
@jwt_required()
def delete_holding(holding_id):

    user_id = int(get_jwt_identity())

    holding = (
        Holding.query
        .join(Portfolio)
        .filter(
            Holding.id == holding_id,
            Portfolio.user_id == user_id
        )
        .first()
    )

    if holding is None:
        return jsonify({"msg": "Holding not found"}), 404

    db.session.delete(holding)
    db.session.commit()

    return jsonify({
        "msg": "Holding deleted successfully"
    })