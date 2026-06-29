import "../styles/portfolio.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    addHolding,
    deleteHolding,
} from "../services/holdingsService";

import {
    getPortfolioSummary,
} from "../services/marketService";

function PortfolioDetails() {

const navigate = useNavigate();

const { portfolioId } = useParams();

const [portfolio, setPortfolio] = useState(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const loadPortfolio = async () => {

    try {

        setLoading(true);

        const data = await getPortfolioSummary(
            portfolioId
        );

        setPortfolio(data);

        setError("");

    }

    catch (err) {

        setError(
            err.msg ||
            "Unable to load portfolio."
        );

    }

    finally {

        setLoading(false);

    }

};

const [formData, setFormData] = useState({

        ticker: "",

        asset_type: "Stock",

        quantity: "",

        purchase_price: ""

    });

    useEffect(() => {

        loadPortfolio();

    }, [portfolioId]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.ticker.trim()) {

            alert("Ticker is required.");

            return;

        }

        if (Number(formData.quantity) <= 0) {

            alert("Quantity must be greater than zero.");

            return;

        }

        if (Number(formData.purchase_price) <= 0) {

            alert("Purchase price must be greater than zero.");

            return;

        }

        try {

            await addHolding(portfolioId, formData);

            setFormData({

                ticker: "",

                asset_type: "Stock",

                quantity: "",

                purchase_price: "",

            });

            loadPortfolio();

        }

        catch (err) {

            alert(err.msg || "Unable to add holding.");

        }

    };

    const handleDeleteHolding = async (holdingId) => {

        if (!window.confirm("Delete this holding?")) {

            return;

        }

        try {

            await deleteHolding(holdingId);

            loadPortfolio();

        }

        catch (err) {

            alert(err.msg || "Unable to delete holding.");

        }

    };

    if (loading) {

        return <h2>Loading Portfolio...</h2>;

    }

    if (error) {

        return (

            <div>

                <h2>{error}</h2>

                <button onClick={loadPortfolio}>

                    Retry

                </button>

            </div>

        );

    }

    return (

        <div className="portfolio-container">

        <button
        onClick={() => navigate("/dashboard")}
        >

        ← Dashboard

        </button>

        <h1>

        {portfolio.portfolio_name}

        </h1>

        <div className="summary-grid">

        <div className="summary-card">

        <h4>Investment</h4>

        <h2>

        ₹{portfolio.summary.total_investment.toLocaleString()}

        </h2>

        </div>

        <div className="summary-card">

        <h4>Current Value</h4>

        <h2>

        ₹{portfolio.summary.current_value.toLocaleString()}

        </h2>

        </div>

        <div className="summary-card">

        <h4>Profit</h4>

        <h2

        className={
        portfolio.summary.profit >=0
        ?
        "profit"
        :
        "loss"
        }

        >

        ₹{portfolio.summary.profit.toLocaleString()}

        </h2>

        </div>

        <div className="summary-card">

        <h4>Return</h4>

        <h2

        className={
        portfolio.summary.profit >=0
        ?
        "profit"
        :
        "loss"
        }

        >

        {portfolio.summary.profit_percent}%

        </h2>

        </div>

        </div>

        <hr />

            <h2>Add Holding</h2>

            <form onSubmit={handleSubmit}>

                <input

                    name="ticker"

                    placeholder="Ticker (AAPL)"

                    value={formData.ticker}

                    onChange={handleChange}

                />

                <select

                    name="asset_type"

                    value={formData.asset_type}

                    onChange={handleChange}

                >

                    <option>Stock</option>

                    <option>ETF</option>

                    <option>Mutual Fund</option>

                    <option>Crypto</option>

                    <option>Bond</option>

                </select>

                <input

                    name="quantity"

                    type="number"

                    placeholder="Quantity"

                    value={formData.quantity}

                    onChange={handleChange}

                />

                <input

                    name="purchase_price"

                    type="number"

                    placeholder="Purchase Price"

                    value={formData.purchase_price}

                    onChange={handleChange}

                />

                <button type="submit">

                    Add Holding

                </button>

            </form>

            <hr />

            <h2>Holdings</h2>

            {

                portfolio.holdings.length === 0 ?

                (

                    <p>No holdings added yet.</p>

                )

                :

                (

                    portfolio.holdings.map((holding) => (

                        <div

                            key={holding.id}

                            style={{

                                border: "1px solid #ccc",

                                marginBottom: "12px",

                                padding: "12px",

                            }}

                        >

                            <h3>{holding.ticker}</h3>

                            <p>

                                Asset Type : {holding.asset_type}

                            </p>

                            <p>

                                Quantity : {holding.quantity}

                            </p>

                            <p>

                                Purchase Price : ₹{holding.purchase_price}

                            </p>

                            <p>

                                Purchase Date :

                                {" "}

                                {

                                    new Date(

                                        holding.purchase_date

                                    ).toLocaleDateString()

                                }

                            </p>

                            <button

                                onClick={() =>

                                    handleDeleteHolding(

                                        holding.id

                                    )

                                }

                            >

                                Delete

                            </button>

                        </div>

                    ))

                )

            }

        </div>

    );

}

export default PortfolioDetails;