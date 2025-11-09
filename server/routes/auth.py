from Flask import Blueprint, request, jsonify
from app import db
from models import User
from flask_jwt_extended import create_access_token
from datetime import timedelta

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already registered"}), 400
    user = User(email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully"}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user and user.check_password(data["password"]):
        access_token = create_access_token(
            identity=user.id, expires_delta=timedelta(hours=1)
        )
        return jsonify({"access_token": access_token}), 200
    return jsonify({"msg": "Invalid email or password"}), 401
