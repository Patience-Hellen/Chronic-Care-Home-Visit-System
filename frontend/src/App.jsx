import { useEffect, useState } from 'react';
import DataModal from './components/DataModal';
import Sidebar from './components/Sidebar';
import CHWView from './pages/CHWView';
import DoctorView from './pages/DoctorView';
import MonitoringLog from './pages/MonitoringLog';
import PatientView from './pages/PatientView';
import ProfileView from './pages/ProfileView';
import RoleSelect from './pages/RoleSelect';
import { clinicalService } from './services/api'; // <--- ADD THIS LINE
import './styles/Dashboard.css';

const BASE_URL = 'http://127.0.0.1:8000/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [visits, setVisits] = useState([]);

  const syncSystemState = async () => {
    if (!user) return;
    try {
      const vRes = await fetch(`${BASE_URL}/visits/`);
      const vData = await vRes.json();
      setAlerts(vData.alerts || []);
      setVisits(vData.visits || []);

      const rRes = await fetch(`${BASE_URL}/readings/`);
      const rData = await rRes.json();
      if (Array.isArray(rData)) setHistory(rData);
    } catch (err) {
      console.error("Connection lost to Django Backend.");
    }
  };

  useEffect(() => {
    syncSystemState();
    const interval = setInterval(syncSystemState, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handlePatientSubmit = async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/readings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      // If the backend returned a 400 (Illogical value rejection)
      if (!response.ok) {
        alert(result.message || "Invalid Input detected by clinical engine.");
        return; // STOP HERE, don't close modal
      }

      // Success
      if (result.advisory) alert(result.advisory);
      setShowModal(false);
      await syncSystemState();
    } catch (err) {
      alert("Submission Error: Backend not responding.");
    }
  };

  const handleDoctorDispatch = async (alertId, chwName, patientName) => {
    try {
      await fetch(`${BASE_URL}/visits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dispatch', alert_id: alertId, chw_name: chwName, patient_name: patientName })
      });
      await syncSystemState();
    } catch (err) { console.error(err); }
  };

  const handleCHWComplete = async (visitId, notes, outcome) => {
    try {
      await fetch(`${BASE_URL}/visits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', visit_id: visitId, notes: notes })
      });
      await syncSystemState();
    } catch (err) { console.error(err); }
  };

  if (!user) return <RoleSelect onSelect={(role) => { setUser({ role }); setActiveTab('dashboard'); }} />;

  return (
    <div className="app-container">
      <Sidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setUser(null)} alertCount={alerts.length} />

      <main className="main-content">
        {user.role === 'doctor' && (
          <DoctorView activeTab={activeTab} alerts={alerts} visits={visits} onDispatch={handleDoctorDispatch} />
        )}

        {user.role === 'patient' && (
          <>
            {activeTab === 'dashboard' && (
              <PatientView
                data={{
                  history: history,
                  alerts: alerts.map(a => a.msg || a.message),
                  latestBP: history.find(h => h.type === 'bp')?.val || '0/0',
                  latestGlucose: history.find(h => h.type === 'glucose')?.val || '0'
                }}
                onManualInput={() => setShowModal(true)}
                onSync={async () => {
                  const deviceData = await clinicalService.syncDeviceData();
                  handlePatientSubmit(deviceData);
                }}
              />
            )}
            {activeTab === 'monitoring' && <MonitoringLog data={history} onManualInput={() => setShowModal(true)} />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}

        {user.role === 'chw' && (
          <CHWView activeTab={activeTab} visits={visits} onComplete={handleCHWComplete} />
        )}
      </main>

      {showModal && <DataModal onClose={() => setShowModal(false)} onSubmit={handlePatientSubmit} />}
    </div>
  );
}