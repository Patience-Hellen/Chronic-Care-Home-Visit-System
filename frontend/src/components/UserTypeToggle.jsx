import './UserTypeToggle.css';

export default function UserTypeToggle({ userType, setUserType }) {
    return (
        <div className="toggle-container">
            <button
                className={userType === 'patient' ? 'active' : ''}
                onClick={() => setUserType('patient')}
            >
                Patient Sign In
            </button>

            <button
                className={userType === 'doctor' ? 'active' : ''}
                onClick={() => setUserType('doctor')}
            >
                Doctor Sign In
            </button>
        </div>
    );
}