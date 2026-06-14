from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Portfolio, Holdings

bp = Blueprint("holdings", __name__, url_prefix="/holdings")


@bp.route("/<int:portfolio_id>", methods=["GET"])
@jwt_required()
def get_holdings(portfolio_id):
    user_id = get_jwt_identity()
    portfolio = Portfolio.query.filter_by(
        id=portfolio_id,
        user_id=user_id,
    ).first()

    if not portfolio:
        return jsonify({"msg": "Portfolio not found"}), 404

    holdings = Holdings.query.filter_by(portfolio_id=portfolio_id).all()

    return jsonify(
        [
            {
                "id": holding.id,
                "name": holding.name,
                "type": holding.type,
                "quantity": holding.quantity,
                "purchase_price": holding.purchase_price,
                "purchase_date": holding.purchase_date.isoformat(),
            }
            for holding in holdings
        ]
    )


@bp.route("/<int:portfolio_id>", methods=["POST"])
@jwt_required()
def add_holding(portfolio_id):
    user_id = get_jwt_identity()
    portfolio = Portfolio.query.filter_by(
        id=portfolio_id,
        user_id=user_id,
    ).first()

    if not portfolio:
        return jsonify({"msg": "Portfolio not found"}), 404

    data = request.get_json()
    holding = Holdings(
        name=data["name"],
        type=data["type"],
        quantity=data["quantity"],
        purchase_price=data["purchase_price"],
        portfolio_id=portfolio_id,
    )

    db.session.add(holding)
    db.session.commit()

    return jsonify({"msg": "Holding added successfully"}), 201


@bp.route("/<int:holding_id>", methods=["PUT"])
@jwt_required()
def update_holding(holding_id):
    user_id = int(get_jwt_identity())

    holding = (
        Holdings.query.join(Portfolio, Holdings.portfolio_id == Portfolio.id)
        .filter(Holdings.id == holding_id, Portfolio.user_id == user_id)
        .first()
    )

    if not holding:
        return jsonify({"msg": "Holding not found"}), 404

    data = request.get_json()

    holding.name = data.get("name", holding.name)
    holding.type = data.get("type", holding.type)
    holding.quantity = data.get("quantity", holding.quantity)
    holding.purchase_price = data.get("purchase_price", holding.purchase_price)

    db.session.commit()

    return jsonify({"msg": "Holding updated successfully"})


@bp.route("/<int:holding_id>", methods=["DELETE"])
@jwt_required()
def delete_holding(holding_id):
    user_id = int(get_jwt_identity())

    holding = (
        Holdings.query.join(Portfolio, Holdings.portfolio_id == Portfolio.id)
        .filter(Holdings.id == holding_id, Portfolio.user_id == user_id)
        .first()
    )

    if not holding:
        return jsonify({"msg": "Holding not found"}), 404

    db.session.delete(holding)
    db.session.commit()

    return jsonify({"msg": "Holding deleted successfully"})
