import { useEffect, useState } from 'react';
import DataModal from './components/DataModal';
import Sidebar from './components/Sidebar';
import CHWView from './pages/CHWView';
import DoctorView from './pages/DoctorView';
import MonitoringLog from './pages/MonitoringLog';
import PatientView from './pages/PatientView';
import ProfileView from './pages/ProfileView';
import RoleSelect from './pages/RoleSelect';
import './styles/Dashboard.css';

const BASE_URL = 'http://127.0.0.1:8000/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  // --- SOURCE OF TRUTH (Local State for smooth demo) ---
  const [history, setHistory] = useState([
    { id: 1, date: 'MAY 04', metric: 'BLOOD PRESSURE', val: '120/80', type: 'bp' }
  ]);
  const [alerts, setAlerts] = useState([]); 
  const [visits, setVisits] = useState([]);

  // 1. REFRESH ENGINE (Tries backend, stays local if fails)
  const refreshData = async () => {
    if (!user) return;
    try {
      const vRes = await fetch(`${BASE_URL}/visits/`);
      if (vRes.ok) {
          const vData = await vRes.json();
          setAlerts(vData.alerts || []);
          setVisits(vData.visits || []);
      }
      
      const rRes = await fetch(`${BASE_URL}/readings/`);
      if (rRes.ok) {
          const rData = await rRes.json();
          setHistory(rData);
      }
    } catch (err) {
      console.warn("Backend offline - Using local simulation mode.");
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // 2. LOGIC: Patient Submits
  const handlePatientSubmit = async (formData) => {
    const newVal = formData.type === 'hypertension' ? `${formData.systolic}/${formData.diastolic}` : formData.glucose;
    
    // Create local entry immediately so the UI updates even without backend
    const localEntry = {
      id: Date.now(),
      date: 'MAY 07',
      metric: formData.type === 'hypertension' ? 'BLOOD PRESSURE' : 'BLOOD GLUCOSE',
      val: newVal,
      type: formData.type === 'hypertension' ? 'bp' : 'glucose'
    };

    setHistory([localEntry, ...history]);

    // Check for alerts locally for the demo
    if (parseInt(formData.systolic) >= 180 || parseFloat(formData.glucose) >= 15) {
      const newAlert = { id: Date.now(), patient: "Waweru Kimani", msg: `Critical ${localEntry.metric}: ${newVal}` };
      setAlerts([newAlert, ...alerts]);
      
      if (formData.symptoms?.length > 0 && formData.type === 'hypertension') {
          alert("⚠️ EMERGENCY: Signs of Hypertensive Crisis/Stroke detected. Seek medical care.");
      }
    }

    // Try to save to backend in background
    fetch(`${BASE_URL}/readings//`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch(() => console.log("Silent fail: Saving locally only."));

    setShowModal(false);
  };

  // 3. LOGIC: Doctor Dispatches
  const handleDoctorDispatch = async (alertId, chwName, patientName) => {
    const newVisit = {
      id: Date.now(),
      patient: patientName,
      chw: chwName,
      status: 'SCHEDULED',
      date: 'MAY 07',
      reason: 'Critical Vital Review'
    };

    // Update locally for the demo
    setVisits([newVisit, ...visits]);
    setAlerts(alerts.filter(a => a.id !== alertId));

    // Try backend
    fetch(`${BASE_URL}/visits/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dispatch', alert_id: alertId, chw_name: chwName, patient_name: patientName })
    }).catch(() => {});
  };

  // 4. LOGIC: CHW Saves
  const handleCHWComplete = async (visitId, notes, outcome) => {
    setVisits(visits.map(v => v.id === visitId ? { ...v, status: 'VERIFIED', outcome: notes } : v));

    fetch(`${BASE_URL}/visits/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete', visit_id: visitId, notes: notes })
    }).catch(() => {});
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
                data={{ history, alerts: alerts.map(a => a.msg), latestBP: history.find(h=>h.type==='bp')?.val || '0/0', latestGlucose: history.find(h=>h.type==='glucose')?.val || '0' }} 
                onManualInput={() => setShowModal(true)}
                onSync={() => handlePatientSubmit({type: 'hypertension', systolic: 195, diastolic: 105, symptoms: ['Dizziness']})}
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