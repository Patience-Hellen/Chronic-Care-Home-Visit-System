import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PatientView({ data, onManualInput, onSync }) {

    // 1. PROCESS DATA: We need a format where each point can have both BP and Glucose
    // Clinical systems usually "pivot" data so lines don't break.
    const chartData = [...data.history].reverse().map(item => ({
        date: item.date,
        // Extract systolic if it's a BP record
        hypertension: item.type === 'bp' ? parseInt(item.val.split('/')[0]) : null,
        // Extract float if it's a Glucose record
        glucose: item.type === 'glucose' ? parseFloat(item.val) : null,
    }));

    return (
        <div className="main-content">
            {/* --- PAGE HEADER --- */}
            <header className="page-header">
                <div style={{ fontWeight: '800', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                    ACTIVE ALERTS:
                    <span className="alert-pill" style={{ marginLeft: '10px' }}>
                        {data.alerts?.length || 0}
                    </span>
                </div>
            </header>

            {/* --- 1. TOP STATS ROW --- */}
            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <span className="stat-label">BP Latest</span>
                    <div className="stat-val">{data.latestBP || '0/0'}</div>
                    <span className="stat-sub">mmHg • CHECKED TODAY</span>
                </div>

                <div className="glass-card stat-card">
                    <span className="stat-label">Glucose Level</span>
                    <div className="stat-val">{data.latestGlucose || '0'}</div>
                    <span className="stat-sub">mmol/L • STABLE</span>
                </div>

                <div className="glass-card stat-card">
                    <span className="stat-label">Med Adherence</span>
                    <div className="stat-val" style={{ color: '#2563eb' }}>95%</div>
                    <span className="stat-sub" style={{ color: '#2563eb' }}>ON TRACK</span>
                </div>

                <div className="glass-card stat-card">
                    <div className="action-group">
                        <button className="btn-primary" onClick={onManualInput}>
                            + Submit Data
                        </button>
                        <button className="btn-primary" onClick={onSync}>
                            <RefreshCw size={14} /> Sync Device
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 2. MAIN DASHBOARD CONTENT --- */}
            <div className="dashboard-grid">

                {/* LEFT COLUMN: THE DUAL-AXIS GRAPH */}
                <div className="glass-card">
                    <div className="card-title-row">
                        <h3 style={{ fontSize: '14px', fontWeight: '800' }}>Clinical Trends: Vital Signs</h3>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: '700' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></div> Hypertension (Left)
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: '700' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div> Glucose (Right)
                            </div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                                    dy={10}
                                />

                                {/* LEFT Y-AXIS: Blood Pressure */}
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    domain={[0, 220]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#2563eb', fontWeight: 700 }}
                                    label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#2563eb', fontWeight: 800 }}
                                />

                                {/* RIGHT Y-AXIS: Glucose */}
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    domain={[0, 20]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#10b981', fontWeight: 700 }}
                                    label={{ value: 'GLUCOSE (mmol/L)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#10b981', fontWeight: 800 }}
                                />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        fontSize: '12px'
                                    }}
                                    connectNulls={true} // Important: keeps the line continuous even if values are mixed
                                />



                                {/* LINE 1: HYPERTENSION */}
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="hypertension"
                                    stroke="#2563eb"
                                    dot={true}           /* <--- ADD THIS */
                                    activeDot={{ r: 6 }}  /* <--- ADD THIS for hover effect */
                                    fillOpacity={1}
                                    fill="url(#colorBP)"
                                    connectNulls={true}
                                />

                                {/* LINE 2: GLUCOSE */}
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="glucose"
                                    stroke="#10b981"
                                    dot={true}           /* <--- ADD THIS */
                                    activeDot={{ r: 6 }}
                                    fillOpacity={1}
                                    fill="url(#colorGlucose)"
                                    connectNulls={true}
                                />

                                {/* LINE 2: GLUCOSE */}
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="glucose"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorGlucose)"
                                    connectNulls={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RIGHT COLUMN: NOTIFICATIONS & RECORDS */}
                <div className="records-container">
                    <div className="glass-card">
                        <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '20px' }}>NOTIFICATIONS & RECORDS</h3>

                        {data.alerts && data.alerts.map((msg, i) => (
                            <div key={i} className="alert-item-critical">
                                <AlertTriangle size={16} /> {msg}
                            </div>
                        ))}

                        <div style={{ marginTop: '10px' }}>
                            {data.history.slice(0, 5).map((r, i) => (
                                <div className="record-card-styled" key={i}>
                                    <div className="record-label-group">
                                        <b>{r.metric}</b>
                                        <span>{r.date}</span>
                                    </div>
                                    <div className="record-value-bold" style={{ color: r.type === 'bp' ? '#2563eb' : '#10b981' }}>
                                        {r.val}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}