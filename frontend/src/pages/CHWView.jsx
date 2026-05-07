import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isValid,
    startOfMonth,
    startOfWeek,
    subMonths
} from 'date-fns';
import { Bell, ChevronLeft, ChevronRight, Phone, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import '../styles/CHWView.css';

export default function CHWView({ activeTab, visits = [], onComplete }) {
    const [showLogModal, setShowLogModal] = useState(false);
    const [activeVisit, setActiveVisit] = useState(null);
    const [outcome, setOutcome] = useState('Stable / Ongoing Monitoring');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Ensure visits is always an array to prevent .filter crashes
    const safeVisits = Array.isArray(visits) ? visits : [];

    const renderCalendarGrid = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="cal-header">{d}</div>
                ))}
                {calendarDays.map((day, i) => {
                    // Check if there's a visit for this day
                    const dayVisits = safeVisits.filter(v => {
                        const vDate = v.date_obj ? new Date(v.date_obj) : (v.date ? new Date(v.date) : null);
                        return vDate && isValid(vDate) && isSameDay(day, vDate);
                    });

                    return (
                        <div key={i} className={`cal-day ${!isSameMonth(day, monthStart) ? 'disabled' : ''}`}>
                            <span className="cal-num">{format(day, 'd')}</span>
                            {dayVisits.map(v => (
                                <div key={v.id} className={`cal-task-indicator ${v.status?.toLowerCase() || 'scheduled'}`}>
                                    {v.patient?.split(' ')[0] || 'Patient'}: {v.status}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleLogSubmit = (e) => {
        e.preventDefault();
        const notes = e.target.notes?.value || "Visit completed successfully.";
        onComplete(activeVisit?.id, notes, outcome);
        setShowLogModal(false);
    };

    const renderDashboard = () => (
        <div className="chw-container">
            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-val" style={{ color: '#38bdf8' }}>
                        {safeVisits.filter(v => v.status === 'SCHEDULED').length.toString().padStart(2, '0')}
                    </div>
                    <span className="stat-sub">SCHEDULED</span>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-val">
                        {safeVisits.filter(v => v.status === 'VERIFIED').length.toString().padStart(2, '0')}
                    </div>
                    <span className="stat-sub success">VERIFIED</span>
                </div>
                <div className="glass-card stat-card"><div className="stat-val">12</div><span className="stat-sub primary">NETWORK</span></div>
                <div className="glass-card stat-card"><div className="emergency-icon-box"><Phone size={20} fill="white" /></div><div className="emergency-text">EMERGENCY</div></div>
            </div>

            <div className="glass-card">
                <h3>COMMUNITY ACTION ITINERARY</h3>
                <div className="records-container">
                    {safeVisits.filter(v => v.status === 'SCHEDULED').map(v => (
                        <div key={v.id} className="itinerary-item">
                            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                <div className="cal-date-box" style={{ borderRightColor: '#fed7aa' }}>
                                    <small>{v.date?.split(' ')[0] || 'MAY'}</small>
                                    <b>{v.date?.split(' ')[1] || '07'}</b>
                                </div>
                                <div className="record-label-group">
                                    <b style={{ fontSize: '15px' }}>Home Intervention: {v.patient}</b>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>Reason: {v.reason || "Urgent Clinical Review"}</span>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ width: 'auto', padding: '12px 30px' }} onClick={() => { setActiveVisit(v); setShowLogModal(true); }}>START LOG</button>
                        </div>
                    ))}
                    {safeVisits.filter(v => v.status === 'SCHEDULED').length === 0 && <div className="empty-state-box">NO ACTIVE DEPLOYMENTS</div>}
                </div>
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className="chw-container">
            <div className="glass-card">
                <div className="card-title-row">
                    <h3 style={{textTransform:'uppercase'}}>{format(currentMonth, 'MMMM yyyy')}</h3>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn-icon-sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft size={14} /></button>
                        <button className="btn-icon-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={14} /></button>
                    </div>
                </div>
                <div className="calendar-wrapper">
                    {renderCalendarGrid()}
                </div>
            </div>
        </div>
    );

    const renderArchive = () => (
        <div className="chw-container">
            <div className="glass-card">
                <h3>VISIT DOCUMENTATION ARCHIVE</h3>
                <div className="records-container">
                    {safeVisits.filter(v => v.status === 'VERIFIED').map(v => (
                        <div key={v.id} className="record-card-styled" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div className="cal-date-box"><small>MAY</small><b>07</b></div>
                                <div className="record-label-group">
                                    <b>Interaction with {v.patient}</b>
                                    <span style={{ color: '#10b981', fontWeight: 800 }}>VERIFIED COMPLETION</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <small style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800 }}>FINAL OUTCOME</small>
                                <div className="final-outcome-pill" style={{marginTop:'5px'}}>{v.outcome || "Stable"}</div>
                            </div>
                        </div>
                    ))}
                    {safeVisits.filter(v => v.status === 'VERIFIED').length === 0 && <div className="empty-state-box">NO ARCHIVED LOGS FOUND</div>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-content">
            <header className="page-header">
                <div className="header-stats">TODAY'S VISITS: <strong>{safeVisits.filter(v => v.status === 'SCHEDULED').length} PENDING</strong></div>
                <Bell size={20} color="#64748b" />
            </header>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'schedule' && renderSchedule()}
            {activeTab === 'documentation' && renderArchive()}

            {showLogModal && (
                <div className="modal-overlay">
                    <form className="clinical-modal" onSubmit={handleLogSubmit}>
                        <div className="modal-header"><h3>CLINICAL INTERACTION LOG</h3><X onClick={() => setShowLogModal(false)} cursor="pointer" /></div>
                        <div className="hub-item" style={{background:'#eff6ff', marginBottom:'20px'}}>
                            <b>Patient: {activeVisit?.patient}</b>
                        </div>
                        <div className="modal-input-row">
                            <div className="modal-field-group"><label>STATE</label><select className="modal-input"><option>Improving</option><option>Stable</option><option>Deteriorating</option></select></div>
                            <div className="modal-field-group"><label>ADHERENCE</label><select className="modal-input"><option>Yes, verified</option><option>Partially</option></select></div>
                        </div>
                        <textarea name="notes" className="modal-input" style={{ marginTop: '20px' }} rows="4" placeholder="Type clinical findings here..." required></textarea>
                        <select className="modal-input" style={{ marginTop: '20px' }} value={outcome} onChange={e => setOutcome(e.target.value)}>
                            <option>Stable / Ongoing Monitoring</option><option>Lifestyle Counselling</option><option>Emergency Referral (Hospital)</option>
                        </select>
                        {outcome === 'Emergency Referral (Hospital)' && (
                            <div className="emergency-protocol-box">
                                <div className="protocol-header"><ShieldAlert size={18} /> Emergency Protocol Active</div>
                                <button type="button" className="btn-emergency-call">Call Dispatch (999)</button>
                            </div>
                        )}
                        <button type="submit" className="btn-log" style={{ marginTop: '20px' }}>SUBMIT DOCUMENTATION</button>
                    </form>
                </div>
            )}
        </div>
    );
}