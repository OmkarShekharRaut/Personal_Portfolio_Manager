from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Portfolio, Holdings

import logging

logger = logging.getLogger(__name__)


bp = Blueprint("portfolio", __name__, url_prefix="/portfolio")


@bp.route("/", methods=["POST"])
@jwt_required()
def create_portfolio():
    user_id = get_jwt_identity()
    data = request.get_json()

    portfolio = Portfolio(name=data["name"], user_id=user_id)

    db.session.add(portfolio)
    db.session.commit()

    return jsonify({"msg": "Portfolio created successfully"}), 201


@bp.route("/", methods=["GET"])
@jwt_required()
def get_portfolios():
    user_id = get_jwt_identity()
    portfolios = Portfolio.query.filter_by(user_id=user_id).all()

    print("PORTFOLIO FETCH from", request.remote_addr)

    return jsonify(
        [
            {
                "id": portfolio.id,
                "name": portfolio.name,
            }
            for portfolio in portfolios
        ]
    )


@bp.route("/<int:portfolio_id>", methods=["DELETE"])
@jwt_required()
def delete_portfolio(portfolio_id):
    user_id = get_jwt_identity()
    portfolio = Portfolio.query.filter_by(
        id=portfolio_id,
        user_id=user_id,
    ).first()

    if not portfolio:
        return jsonify({"msg": "Portfolio not found"}), 404

    db.session.query(Holdings).filter_by(portfolio_id=portfolio_id).delete()

    db.session.delete(portfolio)
    db.session.commit()

    return jsonify({"msg": "Portfolio deleted successfully"}), 200
