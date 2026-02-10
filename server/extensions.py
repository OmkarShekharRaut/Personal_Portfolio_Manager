from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {"msg": f"Invalid token: {error}"}, 422


@jwt.unauthorized_loader
def missing_token_callback(error):
    return {"msg": f"Missing token: {error}"}, 401
