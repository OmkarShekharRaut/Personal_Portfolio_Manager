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

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [portfolioName, setPortfolioName] = useState("");

    const loadData = async () => {

        try {

            setLoading(true);

            const data = await getPortfolios();

            setPortfolios(data);

            setError("");

        }

        catch (err) {

            setError(err.msg || "Unable to load portfolios.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    const handleCreate = async () => {

        if (!portfolioName.trim()) {

            alert("Portfolio name is required.");

            return;

        }

        try {

            await createPortfolio(portfolioName);

            setPortfolioName("");

            loadData();

        }

        catch (err) {

            alert(err.msg);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this portfolio?")) {

            return;

        }

        try {

            await deletePortfolio(id);

            loadData();

        }

        catch (err) {

            alert(err.msg);

        }

    };

    if (loading) {

        return <h2>Loading Dashboard...</h2>;

    }

    if (error) {

        return (

            <div>

                <h2>{error}</h2>

                <button onClick={loadData}>

                    Retry

                </button>

            </div>

        );

    }

    const totalHoldings = portfolios.reduce(

        (sum, portfolio) =>

            sum + portfolio.holding_count,

        0

    );

    return (

        <div>

            <h1>Dashboard</h1>

            <hr />

            <h2>Summary</h2>

            <p>

                Total Portfolios :

                {" "}

                <b>{portfolios.length}</b>

            </p>

            <p>

                Total Holdings :

                {" "}

                <b>{totalHoldings}</b>

            </p>

            <p>

                Portfolio Value :

                <b>

                    {" "}Coming Soon

                </b>

            </p>

            <hr />

            <h2>Create Portfolio</h2>

            <input

                value={portfolioName}

                placeholder="Portfolio Name"

                onChange={(e) =>

                    setPortfolioName(

                        e.target.value

                    )

                }

            />

            <button onClick={handleCreate}>

                Create

            </button>

            <hr />

            <h2>My Portfolios</h2>

            {

                portfolios.length === 0 ?

                (

                    <p>

                        No portfolios yet.

                    </p>

                )

                :

                (

                    portfolios.map((portfolio) => (

                        <div

                            key={portfolio.id}

                            style={{

                                border: "1px solid #ccc",

                                padding: "12px",

                                marginBottom: "10px",

                            }}

                        >

                            <h3>

                                {portfolio.name}

                            </h3>

                            <p>

                                Holdings :

                                {" "}

                                {portfolio.holding_count}

                            </p>

                            <button

                                onClick={() =>

                                    navigate(

                                        `/holdings/${portfolio.id}`

                                    )

                                }

                            >

                                Open

                            </button>

                            {" "}

                            <button

                                onClick={() =>

                                    handleDelete(

                                        portfolio.id

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

export default Dashboard;