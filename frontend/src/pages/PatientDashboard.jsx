import { Activity, ArrowUpDown, Calendar, FileText, Filter, User } from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import './PatientDashboard.css';

const bpData = [
    { date: '03/15', systolic: 120, diastolic: 80 },
    { date: '03/16', systolic: 122, diastolic: 82 },
    { date: '03/17', systolic: 118, diastolic: 78 },
    { date: '03/18', systolic: 125, diastolic: 84 },
    { date: '03/19', systolic: 121, diastolic: 80 },
    { date: '03/20', systolic: 119, diastolic: 77 },
    { date: '03/21', systolic: 123, diastolic: 81 },
    { date: '03/22', systolic: 120, diastolic: 80 },
];

const glucoseData = [
    { date: '03/15', level: 95 }, { date: '03/16', level: 102 },
    { date: '03/17', level: 88 }, { date: '03/18', level: 112 },
    { date: '03/19', level: 98 }, { date: '03/20', level: 92 },
    { date: '03/21', level: 105 }, { date: '03/22', level: 97 },
];

const heartData = [
    { date: '03/15', rate: 73 }, { date: '03/16', rate: 76 },
    { date: '03/17', rate: 69 }, { date: '03/18', rate: 79 },
    { date: '03/19', rate: 72 }, { date: '03/20', rate: 70 },
    { date: '03/21', rate: 75 }, { date: '03/22', rate: 74 },
];

const tableData = [
    { date: '22/03/26', time: '08:30 AM', type: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal', by: 'Patient' },
    { date: '22/03/26', time: '08:25 AM', type: 'Blood Glucose', value: '97 mg/dL', status: 'Normal', by: 'Patient' },
    { date: '22/03/26', time: '08:20 AM', type: 'Heart Rate', value: '73 bpm', status: 'Normal', by: 'Patient' },
    { date: '21/03/26', time: '09:15 AM', type: 'Blood Pressure', value: '123/81 mmHg', status: 'Normal', by: 'Patient' },
    { date: '21/03/26', time: '09:10 AM', type: 'Blood Glucose', value: '105 mg/dL', status: 'Normal', by: 'Patient' },
    { date: '21/03/26', time: '09:05 AM', type: 'Heart Rate', value: '74 bpm', status: 'Normal', by: 'Patient' },
    { date: '20/03/26', time: '07:45 AM', type: 'Blood Pressure', value: '119/77 mmHg', status: 'Normal', by: 'Patient' },
    { date: '20/03/26', time: '07:40 AM', type: 'Blood Glucose', value: '92 mg/dL', status: 'Normal', by: 'Patient' },
];

const PatientDashboard = () => {
    return (
        <div className="dashboard-container">
            <header className="main-header">
                <div className="logo">
                    <Activity className="logo-icon" size={20} />
                    <span>Patient Data Visualization</span>
                </div>
                <div className="header-actions">
                    <button className="nav-link">
                        <FileText size={18} color="#2563eb" /> Reading History
                    </button>
                    <div className="nav-link">
                        <User size={18} /> Patient Profile
                    </div>
                </div>
            </header>
            
            <section className="patient-card">
                <div className="patient-info">
                    <h1>Wanjiru Kimani</h1>
                    <p>Patient ID: KNH-2024-3847 | DOB: 14/05/1978 | Age: 47</p>
                </div>
                <div className="card-controls">
                    <button className="control-btn"><Filter size={16} /> Filter</button>
                    <button className="control-btn"><Calendar size={16} /> Date Range</button>
                </div>
            </section>

            <h2 className="section-title">Health Trends (Last 7 Days)</h2>

            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Blood Pressure Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={bpData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 140]} ticks={[0, 35, 70, 105, 140]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="legend">
                        <span className="legend-item"><span className="dot systolic"></span> Systolic</span>
                        <span className="legend-item"><span className="dot diastolic"></span> Diastolic</span>
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Blood Glucose Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={glucoseData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="level" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="legend">
                        <span className="legend-item"><span className="dot glucose"></span> Glucose Level</span>
                    </div>
                </div>
            </div>

            <div className="chart-container full-width-chart">
                <h3>Heart Rate Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={heartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="legend">
                    <span className="legend-item"><span className="dot heart"></span> Heart Rate</span>
                </div>
            </div>

            <h2 className="section-title">Recent Readings</h2>

            <div className="table-card">
                <div className="table-header">
                    <h3>All Readings</h3>
                </div>
                <div className="table-wrapper">
                    <table className="readings-table">
                        <thead>
                            <tr>
                                <th>DATE <ArrowUpDown size={14} /></th>
                                <th>TIME <ArrowUpDown size={14} /></th>
                                <th>READING TYPE <ArrowUpDown size={14} /></th>
                                <th>VALUE <ArrowUpDown size={14} /></th>
                                <th>STATUS <ArrowUpDown size={14} /></th>
                                <th>RECORDED BY <ArrowUpDown size={14} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.date}</td>
                                    <td>{row.time}</td>
                                    <td>{row.type}</td>
                                    <td>{row.value}</td>
                                    <td>{row.status}</td>
                                    <td>{row.by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">Average Blood Pressure (7 days)</p>
                    <p className="stat-value">121/80 mmHg</p>
                    <p className="stat-status success">Within normal range</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Average Blood Glucose (7 days)</p>
                    <p className="stat-value">98 mg/dL</p>
                    <p className="stat-status success">Within normal range</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Average Heart Rate (7 days)</p>
                    <p className="stat-value">73 bpm</p>
                    <p className="stat-status success">Within normal range</p>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;