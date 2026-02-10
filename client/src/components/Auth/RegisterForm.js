import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const result = await registerUser(email, password, name);

        if (result.data.msg && result.status === 201) {
            console.log(result.data.msg);
            navigate('/login');
        } else if (result.data.msg && result.status === 400) {
            console.log(result.data.msg);
            alert(result.data.msg);
        } else {
            console.log('Registration failed');
            alert('Registration failed');
        }
    }
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterForm;