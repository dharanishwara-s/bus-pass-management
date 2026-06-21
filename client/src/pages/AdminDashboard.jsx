import React, { useState, useEffect } from 'react';
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
            await API.put(`/applications/${id}/status`, { status });
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
                                        {app.documentUrl ? <a href={`http://localhost:5000/${app.documentUrl.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>View</a> : 'None'}
                                    </td>
                                    <td style={{padding: '1rem'}}><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
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
}