import { Routes, Route } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import RegisterForm from './components/Auth/RegisterForm';
import LoginForm from './components/Auth/LoginForm';
import PortfolioList from './components/Portfolio/PortfolioList';

function App() {
  return (
    <div >
      <h1>PPM app</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/portfolio" element={<PortfolioList />} />
      </Routes>
    </div>
  );
}

export default App;
