import logging

logging.basicConfig(
    level=logging.DEBUG,  # show everything in dev
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

from extensions import db, jwt
from routes.auth import bp as auth_bp
from routes.portfolio import bp as portfolio_bp
from routes.holdings import bp as holdings_bp

app = Flask(__name__)
app.config.from_object(Config)
# app.config["JWT_SECRET_KEY"] = "DEBUG_JWT_SECRET_123"


CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

db.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(portfolio_bp)
app.register_blueprint(holdings_bp)

if __name__ == "__main__":
    app.run(debug=True)
