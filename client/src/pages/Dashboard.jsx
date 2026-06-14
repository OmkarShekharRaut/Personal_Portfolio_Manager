import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getPortfolios,
    createPortfolio,
    deletePortfolio,
} from "../services/portfolioService";

function Dashboard() {
    const navigate = useNavigate();
    const [portfolios, setPortfolios] = useState([]);
    const [name, setName] = useState("");

    const loadData = async () => {
        try {
            const p = await getPortfolios();

            setPortfolios(p);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async () => {
        await createPortfolio(name);

        setName("");
        loadData();
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Create Portfolio</h2>

            <input
                value={name}
                placeholder="Portfolio Name"
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <button onClick={handleCreate}>
                Create
            </button>

            <h2>Portfolios</h2>

            <div className="portfolio-grid">
                {portfolios.map((portfolio) => (
                    <div
                        key={portfolio.id}
                        className="portfolio-card"
                    >
                        <h3>{portfolio.name}</h3>
                        <button key={portfolio.id}
                            onClick={() =>
                                navigate(`/holdings/${portfolio.id}`)
                            }>Open</button>
                        <button onClick={async () => {
                            await deletePortfolio(portfolio.id);
                            loadData();
                        }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;