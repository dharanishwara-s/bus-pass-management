const fs = require('fs');
const path = require('path');

const dirs = ['src/pages', 'src/components', 'src/utils'];
dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

const files = {
    'src/index.css': `:root {
    --primary: #4F46E5;
    --primary-hover: #4338CA;
    --background: #F3F4F6;
    --surface: #FFFFFF;
    --text: #111827;
    --text-muted: #6B7280;
    --border: #E5E7EB;
    --success: #10B981;
    --danger: #EF4444;
    --warning: #F59E0B;
}

[data-theme="dark"] {
    --primary: #6366F1;
    --primary-hover: #4F46E5;
    --background: #111827;
    --surface: #1F2937;
    --text: #F9FAFB;
    --text-muted: #9CA3AF;
    --border: #374151;
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }

body {
    background-color: var(--background);
    color: var(--text);
    transition: background-color 0.3s, color 0.3s;
}

.app-container { min-height: 100vh; display: flex; flex-direction: column; }

/* Navbar */
.navbar {
    background: var(--surface);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    position: sticky; top: 0; z-index: 100;
}

.nav-brand { font-size: 1.5rem; font-weight: 700; color: var(--primary); text-decoration: none; }
.nav-links { display: flex; gap: 1.5rem; align-items: center; }
.nav-link { color: var(--text); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.nav-link:hover { color: var(--primary); }

/* Glassmorphism Card */
.glass-card {
    background: var(--surface);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
}

/* Forms */
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text); }
.form-input, .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus, .form-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2); }

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
.btn-outline { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
.btn-outline:hover { background: var(--primary); color: white; }

/* Dashboard Grid */
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.status-badge {
    padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600;
}
.status-Pending { background: var(--warning); color: #fff; }
.status-Approved { background: var(--success); color: #fff; }
.status-Rejected { background: var(--danger); color: #fff; }

.auth-container { max-width: 400px; margin: 4rem auto; }
.hero-section { text-align: center; padding: 4rem 2rem; }
.hero-title { font-size: 3rem; margin-bottom: 1rem; color: var(--primary); }
.hero-subtitle { font-size: 1.25rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem; }
`,

    'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`,

    'src/utils/api.js': `import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use(req => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = \`Bearer \${token}\`;
    return req;
});
export default API;`,

    'src/App.jsx': `import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;`,

    'src/components/Navbar.jsx': `import React, { useEffect, useState } from 'react';
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
}`,

    'src/pages/Home.jsx': `import React from 'react';
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
}`,

    'src/pages/Login.jsx': `import React, { useState } from 'react';
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
}`,

    'src/pages/Register.jsx': `import React, { useState } from 'react';
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
}`,

    'src/pages/UserDashboard.jsx': `import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import QRCode from 'react-qr-code';
import { Download } from 'lucide-react';

export default function UserDashboard({ user }) {
    const [applications, setApplications] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [passTypes, setPassTypes] = useState([]);
    const [form, setForm] = useState({ routeId: '', passTypeId: '', document: null });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, routeRes, passRes] = await Promise.all([
                API.get('/applications/my'),
                API.get('/routes'),
                API.get('/passtypes')
            ]);
            setApplications(appRes.data);
            setRoutes(routeRes.data);
            setPassTypes(passRes.data);
        } catch (err) { console.error(err); }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('routeId', form.routeId);
        data.append('passTypeId', form.passTypeId);
        if (form.document) data.append('document', form.document);

        try {
            await API.post('/applications', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Application submitted');
            fetchData();
            setForm({ routeId: '', passTypeId: '', document: null });
        } catch (err) { alert('Error applying'); }
    };

    return (
        <div>
            <h2 style={{marginBottom: '2rem'}}>Welcome, {user?.name}</h2>
            <div className="dashboard-grid">
                <div className="glass-card">
                    <h3>Apply for New Pass</h3>
                    <form onSubmit={handleApply} style={{marginTop: '1.5rem'}}>
                        <div className="form-group">
                            <label className="form-label">Select Route</label>
                            <select required className="form-select" value={form.routeId} onChange={e => setForm({...form, routeId: e.target.value})}>
                                <option value="">-- Choose --</option>
                                {routes.map(r => <option key={r.id} value={r.id}>{r.source} to {r.destination}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pass Duration</label>
                            <select required className="form-select" value={form.passTypeId} onChange={e => setForm({...form, passTypeId: e.target.value})}>
                                <option value="">-- Choose --</option>
                                {passTypes.map(p => <option key={p.id} value={p.id}>{p.name} ({p.durationDays} days)</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Upload ID Proof</label>
                            <input type="file" className="form-input" onChange={e => setForm({...form, document: e.target.files[0]})} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit Application</button>
                    </form>
                </div>

                <div className="glass-card" style={{gridColumn: 'span 2'}}>
                    <h3>Your Passes</h3>
                    <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        {applications.length === 0 ? <p className="form-label">No applications found.</p> : null}
                        {applications.map(app => (
                            <div key={app.id} style={{padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <h4 style={{marginBottom: '0.5rem'}}>{app.Route?.source} ➔ {app.Route?.destination}</h4>
                                    <p className="form-label">Type: {app.PassType?.name} | Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    <p style={{marginTop: '0.5rem'}}>Status: <span className={\`status-badge status-\${app.status}\`}>{app.status}</span></p>
                                </div>
                                {app.status === 'Approved' && (
                                    <div style={{textAlign: 'center'}}>
                                        <div style={{background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '0.5rem'}}>
                                            <QRCode value={app.qrCodeData} size={80} />
                                        </div>
                                        <button className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}><Download size={14}/> Download</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}`,

    'src/pages/AdminDashboard.jsx': `import React, { useState, useEffect } from 'react';
import API from '../utils/api';

export default function AdminDashboard() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const { data } = await API.get('/applications');
            setApplications(data);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(\`/applications/\${id}/status\`, { status });
            fetchApps();
        } catch (err) { alert('Failed to update status'); }
    };

    return (
        <div>
            <h2 style={{marginBottom: '2rem'}}>Admin Dashboard</h2>
            <div className="glass-card">
                <h3>Pass Applications</h3>
                <div style={{overflowX: 'auto', marginTop: '1.5rem'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{borderBottom: '2px solid var(--border)', textAlign: 'left'}}>
                                <th style={{padding: '1rem'}}>User</th>
                                <th style={{padding: '1rem'}}>Route</th>
                                <th style={{padding: '1rem'}}>Type</th>
                                <th style={{padding: '1rem'}}>Document</th>
                                <th style={{padding: '1rem'}}>Status</th>
                                <th style={{padding: '1rem'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id} style={{borderBottom: '1px solid var(--border)'}}>
                                    <td style={{padding: '1rem'}}>{app.User?.name}</td>
                                    <td style={{padding: '1rem'}}>{app.Route?.source} - {app.Route?.destination}</td>
                                    <td style={{padding: '1rem'}}>{app.PassType?.name}</td>
                                    <td style={{padding: '1rem'}}>
                                        {app.documentUrl ? <a href={\`http://localhost:5000/\${app.documentUrl.replace(/\\\\/g, '/')}\`} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>View</a> : 'None'}
                                    </td>
                                    <td style={{padding: '1rem'}}><span className={\`status-badge status-\${app.status}\`}>{app.status}</span></td>
                                    <td style={{padding: '1rem', display: 'flex', gap: '0.5rem'}}>
                                        {app.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(app.id, 'Approved')} className="btn btn-primary" style={{padding: '0.5rem'}}>Approve</button>
                                                <button onClick={() => updateStatus(app.id, 'Rejected')} className="btn" style={{padding: '0.5rem', background: 'var(--danger)', color: 'white'}}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr><td colSpan="6" style={{padding: '1rem', textAlign: 'center'}}>No applications found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Frontend files generated.');
