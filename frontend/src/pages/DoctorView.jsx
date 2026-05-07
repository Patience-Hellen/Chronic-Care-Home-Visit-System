import { AlertCircle, ClipboardCheck, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import '../styles/DoctorView.css';

export default function DoctorView({ activeTab, alerts = [], visits = [], onDispatch }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    // Mock Registry Data
    const patientRegistry = [
        { id: 1, name: "Waweru Kimani", age: 54, status: "CRITICAL", lastVisit: "May 04" },
        { id: 2, name: "Amina Juma", age: 42, status: "STABLE", lastVisit: "May 01" },
        { id: 3, name: "Samuel Okech", age: 61, status: "WARNING", lastVisit: "Apr 28" },
        { id: 4, name: "Jane Doe", age: 35, status: "STABLE", lastVisit: "May 06" },
        { id: 5, name: "Peter Kamau", age: 68, status: "CRITICAL", lastVisit: "May 05" }
    ];

    const handleConfirm = (e) => {
        e.preventDefault();
        onDispatch(selectedAlert?.id, "CHW Brian (Nairobi North)", selectedAlert?.patient || e.target.manual_p.value);
        setShowModal(false);
    };

    if (activeTab === 'dashboard') return (
        <div className="doctor-page">
            <header className="page-header">
                <div className="header-stats">
                    ACTIVE ALERTS: <span className="alert-pill">{alerts?.length || 0}</span>
                </div>
                <button className="btn-primary" style={{ width: 'auto' }} onClick={() => { setSelectedAlert(null); setShowModal(true); }}>
                    <Plus size={16} /> NEW VISIT REQUEST
                </button>
            </header>

            <div className="stats-grid">
                <div className="glass-card stat-card"><span className="stat-label">Critical</span><div className="stat-val" style={{color:'#ef4444'}}>{alerts?.length || 0}</div></div>
                <div className="glass-card stat-card"><span className="stat-label">Scheduled</span><div className="stat-val">{visits?.filter(v=>v.status==='SCHEDULED').length || 0}</div></div>
                <div className="glass-card stat-card"><span className="stat-label">Registry</span><div className="stat-val">{patientRegistry.length}</div></div>
                <div className="glass-card stat-card"><span className="stat-label">Verified</span><div className="stat-val">{visits?.filter(v=>v.status==='VERIFIED').length || 0}</div></div>
            </div>

            <div className="dashboard-grid">
                <div className="glass-card">
                    <div className="card-title-row">
                        <h3>URGENT ALERT DASHBOARD</h3>
                        <span className="live-badge">{alerts?.length || 0} LIVE</span>
                    </div>
                    {alerts?.map(a => (
                        <div key={a.id} className="record-card-styled" style={{borderLeft:'4px solid #ef4444', justifyContent:'space-between'}}>
                            <div className="record-label-group"><b>{a.patient}</b><span style={{color:'#ef4444'}}>{a.msg}</span></div>
                            <button className="btn-primary" style={{width:'auto', padding:'8px 16px'}} onClick={() => { setSelectedAlert(a); setShowModal(true); }}>COORDINATE</button>
                        </div>
                    ))}
                    {(!alerts || alerts.length === 0) && <div className="empty-state-box">No Priority Signals Found</div>}
                </div>
                <div className="glass-card">
                    <h3>COORDINATION HUB</h3>
                    <div className="coord-hub-item"><label>PENDING ACTION</label><div>{alerts?.length || 0} patients waiting</div></div>
                    <div className="coord-hub-item" style={{marginTop:'12px'}}><label>CHW COVERAGE</label><div>100% Active</div></div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <form className="clinical-modal" onSubmit={handleConfirm} style={{maxWidth:'450px'}}>
                        <div className="modal-header"><h3>COORDINATE HOME VISIT</h3><X onClick={()=>setShowModal(false)} cursor="pointer"/></div>
                        <div className="hub-item" style={{background:'#fff7ed', marginBottom:'20px'}}><b>{selectedAlert?.msg || "Manual Dispatch"}</b></div>
                        {!selectedAlert && <input name="manual_p" className="modal-input" placeholder="Patient Name" required />}
                        <select className="modal-input" style={{marginTop:'10px'}}><option>CHW Brian (Nairobi North)</option><option>CHW Sarah (Embakasi)</option></select>
                        <button type="submit" className="btn-log" style={{marginTop:'20px'}}>CONFIRM DISPATCH</button>
                    </form>
                </div>
            )}
        </div>
    );

    if (activeTab === 'registry') return (
        <div className="content-full" style={{padding: '32px'}}>
            <div className="glass-card">
                <div className="card-title-row">
                    <h3>PATIENT REGISTRY</h3>
                    <div className="search-bar"><Search size={14}/><input placeholder="Search Registry..."/></div>
                </div>
                <table className="registry-table">
                    <thead><tr><th>PATIENT</th><th>AGE</th><th>LAST CONTACT</th><th>STATUS</th></tr></thead>
                    <tbody>
                        {patientRegistry.map(p => (
                            <tr key={p.id}>
                                <td><div className="patient-cell"><div className="avatar-sq">{p.name[0]}</div><b>{p.name}</b></div></td>
                                <td>{p.age}</td>
                                <td>{p.lastVisit}</td>
                                <td><span className={`pill pill-${p.status.toLowerCase()}`}>{p.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (activeTab === 'chw') return (
        <div className="content-full" style={{padding: '32px'}}>
            <div className="glass-card">
                <h3>CHW DEPLOYMENT & OUTCOMES</h3>
                <div className="records-container" style={{marginTop:'20px'}}>
                    {visits?.map(v => (
                        <div key={v.id} className="record-card-styled" style={{display:'block', padding:'24px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                                <div className="record-label-group">
                                    <b style={{fontSize:'16px'}}>{v.patient}</b>
                                    <span>Assigned to: {v.chw} • {v.date}</span>
                                </div>
                                <span className={`tag-verified ${v.status.toLowerCase() === 'scheduled' ? 'pending-tag' : ''}`}>
                                    {v.status}
                                </span>
                            </div>
                            
                            {v.status === 'VERIFIED' ? (
                                <div className="outcome-box">
                                    <div className="outcome-header"><ClipboardCheck size={14}/> CLINICAL DOCUMENTATION</div>
                                    <p className="outcome-text">{v.notes || v.outcome}</p>
                                </div>
                            ) : (
                                <div className="outcome-box pending">
                                    <AlertCircle size={14}/> Awaiting CHW Log
                                </div>
                            )}
                        </div>
                    ))}
                    {(!visits || visits.length === 0) && <div className="empty-state-box">No deployments found</div>}
                </div>
            </div>
        </div>
    );
}