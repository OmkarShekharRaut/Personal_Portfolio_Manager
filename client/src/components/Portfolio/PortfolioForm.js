import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createPortfolio } from '../../services/api';

function PortfolioForm({ onCreated }) {
    const { token } = useContext(AuthContext);
    const [name, setName] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const data = await createPortfolio(token, name);
        setName("");
        onCreated();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="portfolio name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button type="submit">Create Portfolio</button>
        </form>
    )
}

export default PortfolioForm;