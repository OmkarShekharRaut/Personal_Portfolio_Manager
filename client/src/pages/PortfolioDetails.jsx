import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    getHoldings,
    addHolding,
    deleteHolding,
} from "../services/holdingsService";

function PortfolioDetails() {
    const { portfolioId } = useParams();

    console.log("Portfolio ID:", portfolioId);

    const [holdings, setHolding] = useState([]);

    const [formData, setFormData] = useState({
        ticker: "",
        type: "",
        quantity: "",
        purchase_price: "",
    });

    const token = localStorage.getItem("token");

    const loadHolding = async () => {
        try {
            const data = await getHoldings(portfolioId);
            setHolding(data);
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadHolding();
    }, []);

    const createHolding = async (e) => {
        e.preventDefault();

        try {
            await addHolding(portfolioId, formData);

            setFormData({
                name: "",
                type: "",
                quantity: "",
                purchase_price: "",
            });

            loadHolding();
        }
        catch (err) {
            console.error(err);
        }
    };

    const deleteHolding = async (holdingId) => {
        try {
            await deleteHolding(holdingId);
            loadHolding();
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Portfolio Details</h1>

            <h2>Add Holding</h2>

            <form onSubmit={createHolding}>
                <input
                    placeholder="Asset Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                />

                <input
                    placeholder="Type"
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            type: e.target.value,
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            quantity: e.target.value,
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Purchase Price"
                    value={formData.purchase_price}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            purchase_price: e.target.value,
                        })
                    }
                />

                <button type="submit">
                    Add Holding
                </button>
            </form>

            <hr />

            <h2>Holding</h2>

            {holdings.length === 0 ? (
                <p>No holdings found.</p>
            ) : (
                holdings.map((holding) => (
                    <div
                        key={holding.id}
                        style={{
                            border: "1px solid gray",
                            margin: "10px",
                            padding: "10px",
                        }}
                    >
                        <h3>{holding.name}</h3>

                        <p>Type: {holding.type}</p>

                        <p>
                            Quantity: {holding.quantity}
                        </p>

                        <p>
                            Purchase Price: ₹
                            {holding.purchase_price}
                        </p>

                        <button
                            onClick={() =>
                                deleteHolding(holding.id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default PortfolioDetails;