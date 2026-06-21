import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, BusFront } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand"><BusFront style={{marginRight: 8, verticalAlign: 'middle'}}/>TransitPass</Link>
            <div className="nav-links">
                <button onClick={toggleTheme} className="btn btn-outline" style={{padding: '0.5rem', border:'none'}}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                {!user ? (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </>
                ) : (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link">Dashboard</Link>
                        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}