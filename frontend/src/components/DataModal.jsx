import { X } from 'lucide-react';
import { useState } from 'react';
import '../styles/PatientView.css';

export default function DataModal({ onClose, onSubmit }) {
    const [tab, setTab] = useState('bp');
    const [systolic, setSystolic] = useState('120');
    const [diastolic, setDiastolic] = useState('80');
    const [glucose, setGlucose] = useState('5.5');
    const [symptoms, setSymptoms] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // New: Loading state

    const toggleSymptom = (s) => {
        setSymptoms(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const payload = tab === 'bp' 
            ? { type: 'hypertension', systolic: parseInt(systolic), diastolic: parseInt(diastolic), symptoms }
            : { type: 'diabetes', glucose: parseFloat(glucose), symptoms };
        
        // We call onSubmit which is defined in App.jsx
        await onSubmit(payload);
        setIsSubmitting(false);
    };

    return (
        <div className="modal-overlay">
            <div className="clinical-modal">
                <div className="modal-header">
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div className="logo-sq" style={{width:'15px', height:'15px'}}></div>
                        <h3 style={{margin:0}}>Submit Clinical Data</h3>
                    </div>
                    <X onClick={onClose} style={{cursor:'pointer'}} color="#94a3b8" />
                </div>

                <div className="modal-tabs">
                    <button className={`m-tab ${tab === 'bp' ? 'active' : ''}`} onClick={() => setTab('bp')}>HYPERTENSION</button>
                    <button className={`m-tab ${tab === 'glucose' ? 'active' : ''}`} onClick={() => setTab('glucose')}>DIABETES</button>
                </div>

                {tab === 'bp' ? (
                    <div className="modal-input-row">
                        <div className="modal-field-group">
                            <label>Systolic (Top)</label>
                            <input className="modal-input" type="number" value={systolic} onChange={e => setSystolic(e.target.value)} />
                        </div>
                        <div className="modal-field-group">
                            <label>Diastolic (Bottom)</label>
                            <input className="modal-input" type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} />
                        </div>
                    </div>
                ) : (
                    <div className="modal-field-group" style={{marginBottom: '24px'}}>
                        <label>Glucose Level (mmol/L)</label>
                        <input className="modal-input" type="number" step="0.1" value={glucose} onChange={e => setGlucose(e.target.value)} />
                    </div>
                )}

                <div className="modal-field-group">
                    <label>Select Present Symptoms</label>
                    <p style={{fontSize:'10px', color:'#94a3b8', marginTop:'-5px', marginBottom:'10px'}}>Click to select any abnormal feelings</p>
                    <div className="symptom-grid">
                        {['Dizziness', 'Blurred Vision', 'Numbness', 'Headache', 'Confusion'].map(s => (
                            <button 
                                key={s} 
                                className={`symptom-pill ${symptoms.includes(s) ? 'active' : ''}`}
                                onClick={() => toggleSymptom(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="adherence-row" style={{marginTop:'20px', background:'#f8fafc', padding:'15px', borderRadius:'10px'}}>
                    <input type="checkbox" defaultChecked id="med-check" />
                    <label htmlFor="med-check" style={{fontSize:'11px', fontWeight:800, color:'#475569', marginLeft:'10px'}}>
                        I HAVE TAKEN MY PRESCRIBED MEDICATION TODAY
                    </label>
                </div>

                <button 
                    className="btn-log" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}
                >
                    {isSubmitting ? 'SECURELY SAVING...' : 'Log Interaction & Check Vitals'}
                </button>
            </div>
        </div>
    );
}