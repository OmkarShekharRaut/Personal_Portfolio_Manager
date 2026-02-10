import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { AuthContext } from "../../context/AuthContext";

function LoginForm() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await loginUser(email, password);

        if (response.status === 200) {
            console.log("Login successful");
            login(response.data.access_token);
            navigate('/portfolio');

        } else {
            console.log('Login failed');
            alert(response.data.msg || 'Login failed');
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm;