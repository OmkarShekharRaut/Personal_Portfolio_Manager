import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getHoldings,
    addHolding,
    deleteHolding,
} from "../services/holdingsService";

import { getPortfolioSummary } from "../services/marketService";

function PortfolioDetails() {

    const { portfolioId } = useParams();

    const [holdings, setHoldings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        ticker: "",
        asset_type: "Stock",
        quantity: "",
        purchase_price: "",
    });

    const loadHoldings = async () => {

        try {

            setLoading(true);

            const data = await getHoldings(portfolioId);

            setHoldings(data);

            setError("");

        }

        catch (err) {

            setError(err.msg || "Unable to load holdings.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadHoldings();

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

            loadHoldings();

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

            loadHoldings();

        }

        catch (err) {

            alert(err.msg || "Unable to delete holding.");

        }

    };

    if (loading) {

        return <h2>Loading Holdings...</h2>;

    }

    if (error) {

        return (

            <div>

                <h2>{error}</h2>

                <button onClick={loadHoldings}>

                    Retry

                </button>

            </div>

        );

    }

    return (

        <div>

            <h1>Portfolio Holdings</h1>

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

                holdings.length === 0 ?

                (

                    <p>No holdings added yet.</p>

                )

                :

                (

                    holdings.map((holding) => (

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