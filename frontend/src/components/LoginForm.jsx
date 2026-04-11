import { Link, useNavigate } from "react-router-dom";
import './LoginForm.css';

export default function LoginForm({ userType }) {

    const navigate = useNavigate();
    return (
        <div className="form-container">
            <h2>
                {userType === 'patient' ? 'Patient Login' : 'Doctor Login'}
            </h2>

            <div className="form-group">
                <label>
                    {userType === 'patient' ? 'Patient ID' : 'Doctor ID'}
                </label>
                <input
                    type="text"
                    placeholder={`Enter your ${userType === 'patient' ? 'Patient' : 'Doctor'} ID`}
                />
            </div>
            
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                />
            </div>

            <button
                className="login-btn"
                onClick={() =>
                    navigate(userType === 'patient' ? '/setup-profile' : '/provider')
                }
            >
                LOGIN
            </button>

            <p className="forgot">
                <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                </Link>
            </p>
        </div>
    );
}