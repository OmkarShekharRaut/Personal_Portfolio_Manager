import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolio } from "../../services/api";
import PortfolioForm from "./PortfolioForm";


function PortfolioList() {
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    const [portfolio, setPortfolio] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    console.log("fetchPortfolio called from PortfolioList");


    async function loadPortfolios() {
        try {
            const data = await fetchPortfolio(token);
            setPortfolio(data);
        } catch (error) {
            console.error("Error fetching data", error);
            logout();
            navigate('/login');
        }
    }

    useEffect(() => {
        if (token) {
            loadPortfolios();
        }
    }, [token]);

    return (
        <div>
            <h2>Your Portfolios</h2>

            {portfolio.length === 0 ? (
                <p>No portfolio items</p>
            ) : (
                <ul>
                    {portfolio.map(item => (
                        <li key={item.id}>{item.name}
                            <button onClick={() => navigate(`/portfolio/${item.id}`)}>{item.name}</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => setShowCreate(prev => !prev)}>
                {showCreate ? "Cancel" : "Add Portfolio"}
            </button>

            {/* Create Portfolio Form */}
            {showCreate && (
                <PortfolioForm
                    onCreated={() => {
                        loadPortfolios();
                        setShowCreate(false);
                    }}
                />
            )}
        </div>
    )
}

export default PortfolioList;