import {
    Activity,
    Calendar,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Map,
    User,
    Users
} from 'lucide-react';

export default function Sidebar({ role, activeTab, setActiveTab, onLogout, alertCount }) {
    
    const menuItems = {
        patient: [
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
            { id: 'monitoring', label: 'My Monitoring', icon: <Activity size={18}/> },
            { id: 'profile', label: 'My Profile', icon: <User size={18}/> }
        ],
        doctor: [
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/>, hasAlerts: true },
            { id: 'registry', label: 'Patient Registry', icon: <Users size={18}/> },
            { id: 'chw', label: 'CHW Coordination', icon: <Map size={18}/> }
        ],
        chw: [
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
            { id: 'schedule', label: 'My Schedule', icon: <Calendar size={18}/> },
            { id: 'documentation', label: 'Visit Documentation', icon: <ClipboardList size={18}/> }
        ]
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-sq"></div>
                <div>CareLink<br/>Kenya</div>
            </div>
            
            <nav style={{ flex: 1 }}>
                {menuItems[role]?.map(item => (
                    <div 
                        key={item.id}
                        className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            {item.icon} 
                            <span>{item.label}</span>
                        </div>

                        {/* DOCTOR ALERT BADGE: Now correctly using the alertCount prop */}
                        {role === 'doctor' && item.hasAlerts && alertCount > 0 && (
                            <span className="nav-alert-badge">{alertCount}</span>
                        )}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-label">LOGGED IN AS</div>
                <div style={{ fontWeight: '800', fontSize: '13px', color: 'white', textTransform: 'uppercase', marginBottom: '15px' }}>
                    {role} user
                </div>
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={14} style={{ marginRight: '6px' }}/> Terminate Session
                </button>
            </div>
        </div>
    );
}