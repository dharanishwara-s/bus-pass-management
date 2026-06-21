import React, { useState, useEffect } from 'react';
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
                                    <p style={{marginTop: '0.5rem'}}>Status: <span className={`status-badge status-${app.status}`}>{app.status}</span></p>
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
}