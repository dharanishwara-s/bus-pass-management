import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-container glass-card">
            <h2 style={{marginBottom: '1.5rem', textAlign: 'center'}}>Create Account</h2>
            {error && <div style={{color: 'var(--danger)', marginBottom: '1rem'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" required className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Sign Up</button>
            </form>
        </div>
    );
}