import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, ShieldCheck, Clock } from 'lucide-react';

export default function Home({ user }) {
    return (
        <div className="hero-section">
            <h1 className="hero-title">Seamless Travel with Smart Bus Passes</h1>
            <p className="hero-subtitle">Apply, manage, and renew your bus passes instantly. Experience the next generation of public transit mobility.</p>
            {!user ? (
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                    <Link to="/register" className="btn btn-primary">Get Started <ArrowRight size={18}/></Link>
                    <Link to="/login" className="btn btn-outline">Login</Link>
                </div>
            ) : (
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary">Go to Dashboard</Link>
            )}

            <div className="dashboard-grid" style={{marginTop: '4rem', textAlign: 'left'}}>
                <div className="glass-card">
                    <Ticket color="var(--primary)" size={40} />
                    <h3 style={{margin: '1rem 0'}}>Digital Passes</h3>
                    <p className="form-label">Carry your pass on your smartphone. Secure QR codes ensure fast boarding.</p>
                </div>
                <div className="glass-card">
                    <Clock color="var(--primary)" size={40} />
                    <h3 style={{margin: '1rem 0'}}>Instant Approvals</h3>
                    <p className="form-label">Apply online and get your pass approved faster than traditional methods.</p>
                </div>
                <div className="glass-card">
                    <ShieldCheck color="var(--primary)" size={40} />
                    <h3 style={{margin: '1rem 0'}}>Secure & Reliable</h3>
                    <p className="form-label">Your personal and payment data is secured with enterprise-grade encryption.</p>
                </div>
            </div>
        </div>
    );
}