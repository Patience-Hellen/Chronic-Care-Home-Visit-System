import { Activity, Droplets, Heart } from 'lucide-react';
import '../styles/PatientView.css';

// 1. Add onManualInput to the destructured props
export default function MonitoringLog({ data, onManualInput }) {
    return (
        <div className="main-content">
            <header className="page-header">
                <div style={{fontWeight: '800', fontSize: '11px', color: '#64748b', display:'flex', alignItems:'center'}}>
                    ACTIVE ALERTS: <span className="alert-pill">0</span>
                </div>
            </header>

            <div className="monitoring-log-card">
                <div className="log-header-row">
                    <h3>Clinical Monitoring Log</h3>
                    
                    {/* 2. Attach the function to the onClick event */}
                    <button 
                        className="btn-primary-sm" 
                        style={{padding: '8px 16px', fontSize: '10px', cursor: 'pointer'}}
                        onClick={onManualInput}
                    >
                        + MANUAL LOG
                    </button>
                </div>
                
                <table className="log-table-main">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Adherence</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td className="log-date-cell">
                                    {row.date}
                                    <div style={{fontSize:'11px', color:'#94a3b8', marginTop:'4px'}}>10:30 AM</div>
                                </td>
                                <td>
                                    <div className="log-metric-cell">
                                        {row.type === 'bp' ? <Heart size={16} color="#2563eb"/> : <Droplets size={16} color="#10b981"/>}
                                        {row.metric}
                                    </div>
                                </td>
                                <td style={{fontWeight: '800', fontSize: '16px'}}>{row.val}</td>
                                <td><span className="tag-verified">VERIFIED</span></td>
                                <td><Activity size={18} color="#10b981" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data.length === 0 && (
                    <div className="empty-state-box" style={{padding: '40px'}}>
                        No clinical records found. Click "Manual Log" to add data.
                    </div>
                )}
            </div>
        </div>
    );
}