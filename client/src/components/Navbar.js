import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { token, logout } = useContext(AuthContext);
    const isLoggedIn = !!token;

    return (
        <nav style={{ marginBottom: '20px' }}>
            <Link to="/">Home</Link>
            {!isLoggedIn && (
                <>
                    {" | "}
                    <Link to="/register">Register</Link>
                    {" | "}
                    <Link to="/Login">Login</Link>
                    {" | "}
                </>
            )}
            {isLoggedIn && (
                <>
                    {" | "}
                    <Link to="/portfolio">Portfolio</Link>
                    {" | "}
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    );
}

export default Navbar;