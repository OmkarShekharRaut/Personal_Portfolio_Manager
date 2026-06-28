from extensions import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    name = db.Column(
        db.String(50),
        nullable=False
    )

    hashed_password = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    portfolios = db.relationship(
        "Portfolio",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.hashed_password,
            password
        )


class Portfolio(db.Model):
    __tablename__ = "portfolio"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship(
        "User",
        back_populates="portfolios"
    )

    holdings = db.relationship(
        "Holding",
        back_populates="portfolio",
        cascade="all, delete-orphan"
    )


class Holding(db.Model):
    __tablename__ = "holdings"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    ticker = db.Column(
        db.String(15),
        nullable=False
    )

    asset_type = db.Column(
        db.String(30),
        nullable=False,
        default="Stock"
    )

    quantity = db.Column(
        db.Float,
        nullable=False
    )

    purchase_price = db.Column(
        db.Float,
        nullable=False
    )

    purchase_date = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    portfolio_id = db.Column(
        db.Integer,
        db.ForeignKey("portfolio.id"),
        nullable=False
    )

    portfolio = db.relationship(
        "Portfolio",
        back_populates="holdings"
    )