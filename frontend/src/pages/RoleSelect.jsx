import { ChevronRight, ClipboardList, Stethoscope, User } from 'lucide-react';
import { useState } from 'react';
import '../styles/Auth.css'; // <--- NEW FILE

export default function RoleSelect({ onSelect }) {
    const [view, setView] = useState('select'); // 'select' (List) or 'login' (Form)
    const [role, setRole] = useState('patient');

    const roles = [
        { id: 'patient', label: 'Patient', icon: <User size={18} />, color: '#6366f1', bg: '#eef2ff' },
        { id: 'doctor', label: 'Provider', icon: <Stethoscope size={18} />, color: '#10b981', bg: '#ecfdf5' },
        { id: 'chw', label: 'Community Health Worker', icon: <ClipboardList size={18} />, color: '#a855f7', bg: '#f5f3ff' }
    ];

    if (view === 'select') {
        return (
            <div className="auth-page">
                <div className="auth-card-fixed">
                    <div className="auth-logo-box"></div>
                    <h1 className="auth-title">CareLink Kenya</h1>
                    <p className="auth-sub">Chronic Care Coordination Prototype</p>
                    
                    <p className="auth-menu-label">SELECT ACCESS ROLE</p>
                    <div className="auth-role-list">
                        {roles.map(r => (
                            <button key={r.id} className="auth-role-btn" onClick={() => { setRole(r.id); setView('login'); }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className="auth-icon-bg" style={{ backgroundColor: r.bg, color: r.color }}>{r.icon}</div>
                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{r.label}</span>
                                </div>
                                <ChevronRight size={16} color="#cbd5e1" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card-fixed">
                <div className="auth-logo-box"></div>
                <h1 className="auth-title">CareLink Kenya</h1>
                <p className="auth-sub">Chronic Care Coordination Prototype</p>
                
                <div className="auth-input-group">
                    <label className="auth-label">ACCESS ROLE</label>
                    <div className="auth-tabs">
                        {['doctor', 'chw', 'patient'].map(id => (
                            <button 
                                key={id} 
                                className={`auth-tab ${role === id ? 'active' : ''}`}
                                onClick={() => setRole(id)}
                            >
                                {id === 'doctor' ? 'PROVIDER' : id.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="auth-input-group">
                    <label className="auth-label">USERNAME</label>
                    <input className="auth-field" type="text" value={role} readOnly />
                </div>
                
                <div className="auth-input-group">
                    <label className="auth-label">PASSWORD</label>
                    <input className="auth-field" type="password" value="********" readOnly />
                </div>

                <button className="auth-btn-primary" onClick={() => onSelect(role)}>
                    ENTER DASHBOARD
                </button>
                
                <button className="auth-btn-link" onClick={() => setView('select')}>
                    CHANGE ROLE
                </button>
            </div>
        </div>
    );
}