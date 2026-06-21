import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

export default function Login({ setUser }) {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = formData.role === 'admin' ? '/auth/admin/login' : '/auth/login';
            const { data } = await API.post(url, formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container glass-card">
            <h2 style={{marginBottom: '1.5rem', textAlign: 'center'}}>Welcome Back</h2>
            {error && <div style={{color: 'var(--danger)', marginBottom: '1rem'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Login as</label>
                    <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="user">Passenger</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" required className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
            </form>
            <p style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem'}}>
                Don't have an account? <Link to="/register" style={{color: 'var(--primary)'}}>Sign up here</Link>
            </p>
        </div>
    );
}