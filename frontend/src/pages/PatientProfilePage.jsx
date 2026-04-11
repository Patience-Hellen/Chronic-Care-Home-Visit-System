import {
    AlertCircle,
    CheckCircle,
    Clock,
    History,
    Info,
    LayoutDashboard,
    Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientProfilePage.css';

const PatientProfilePage = ({ userName = "Wanjiru" }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successToast, setSuccessToast] = useState(false);
    
    const [errors, setErrors] = useState({
        systolic: "",
        diastolic: "",
        glucose: ""
    });

    const LIMITS = {
        systolic: { min: 70, max: 250 },
        diastolic: { min: 40, max: 150 },
        glucose: { min: 1, max: 35 }
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const validateForm = (formData) => {
        let newErrors = { systolic: "", diastolic: "", glucose: "" };
        const sys = parseInt(formData.get('systolic'));
        const dia = parseInt(formData.get('diastolic'));
        const glu = parseFloat(formData.get('glucose'));

        if (!sys || sys < LIMITS.systolic.min || sys > LIMITS.systolic.max) 
            newErrors.systolic = `Systolic must be between ${LIMITS.systolic.min}-${LIMITS.systolic.max} mmHg.`;
        
        if (!dia || dia < LIMITS.diastolic.min || dia > LIMITS.diastolic.max) 
            newErrors.diastolic = `Diastolic must be between ${LIMITS.diastolic.min}-${LIMITS.diastolic.max} mmHg.`;
        
        if (sys && dia && dia >= sys) 
            newErrors.diastolic = "Diastolic cannot be higher than or equal to Systolic.";

        if (!glu || glu < LIMITS.glucose.min || glu > LIMITS.glucose.max) 
            newErrors.glucose = `Glucose must be between ${LIMITS.glucose.min}-${LIMITS.glucose.max} mmol/L.`;

        return newErrors;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const validationResults = validateForm(formData);

        if (Object.values(validationResults).some(msg => msg !== "")) {
            setErrors(validationResults);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setErrors({ systolic: "", diastolic: "", glucose: "" });
        setIsSubmitting(true);
        
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessToast(true);
            setTimeout(() => setSuccessToast(false), 3000);
            e.target.reset();
        }, 1200);
    };

    const activeErrorMessages = Object.values(errors).filter(msg => msg !== "");

    return (
        <div className="portal-page">
            {successToast && (
                <div className="toast-notification toast-success fade-in">
                    <CheckCircle size={20} />
                    <span>Reading successfully logged!</span>
                </div>
            )}

            <header className="portal-header-modern">
                <div className="header-inner">
                    <div className="welcome-text">
                        <h1>Welcome, {userName}</h1>
                        <p>{currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <Link to="/patient" className="dashboard-pill">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                </div>
            </header>

            <main className="dual-container-layout">
                <div className="form-container-main">
                    <form onSubmit={handleFormSubmit} noValidate>
                        <div className="section-title">Log Daily Vitals</div>
                        
                        {activeErrorMessages.length > 0 && (
                            <div className="error-summary-box fade-in">
                                <h4><AlertCircle size={18} /> Please correct the following:</h4>
                                <ul>
                                    {activeErrorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="input-grid">
                            <div className="field-group">
                                <label className="label-black">Systolic (High)</label>
                                <div className={`input-with-inner-unit ${errors.systolic ? 'input-error' : ''}`}>
                                    <input name="systolic" type="number" placeholder="120" required />
                                    <span className="inner-unit">mmHg</span>
                                </div>
                            </div>
                            <div className="field-group">
                                <label className="label-black">Diastolic (Low)</label>
                                <div className={`input-with-inner-unit ${errors.diastolic ? 'input-error' : ''}`}>
                                    <input name="diastolic" type="number" placeholder="80" required />
                                    <span className="inner-unit">mmHg</span>
                                </div>
                            </div>
                        </div>

                        <div className="field-group mt-25">
                            <label className="label-black">Blood Glucose</label>
                            <div className={`input-with-inner-unit full-width ${errors.glucose ? 'input-error' : ''}`}>
                                <input name="glucose" type="number" step="0.1" placeholder="5.6" required />
                                <span className="inner-unit">mmol/L</span>
                            </div>
                        </div>

                        <div className="section-title secondary-title mt-25">Additional Information</div>

                        <div className="field-group">
                            <label className="checkbox-label label-black">
                                <input type="checkbox" id="med-check" /> 
                                I have taken my medicine today
                            </label>
                        </div>

                        <textarea 
                            className="modern-textarea" 
                            placeholder="How do you feel? (Dizziness, fatigue, etc.)"
                        ></textarea>
                        
                        <div className="button-row">
                            <button type="submit" className="main-submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'SAVE READINGS'}
                            </button>
                        </div>

                        <p className="auto-log-notice">
                            <Clock size={12} /> Entry will be timestamped for {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </form>
                </div>

                <aside className="summary-sidebar">
                    <div className="summary-card info-blue">
                        <h3><Info size={18} /> Daily Schedule</h3>
                        <div className="freq-badge">2x Daily</div>
                        <p className="small-text">Consistent timing helps your doctor track patterns better.</p>
                    </div>

                    <div className="summary-card">
                        <h3><History size={18} /> Recent Readings</h3>
                        <div className="recent-list">
                            <div className="recent-item">
                                <span>Yesterday, 08:30 PM</span>
                                <strong>128/84 mmHg</strong>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default PatientProfilePage;