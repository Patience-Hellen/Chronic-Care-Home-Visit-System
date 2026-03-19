import { useState } from 'react';
import { ChronoCareLogo } from '../components/ChronoCareLogo';
import LoginForm from '../components/LoginForm';
import UserTypeToggle from '../components/UserTypeToggle';
import './LoginPage.css';

export default function LoginPage() {
    const [userType, setUserType] = useState('patient');

    return (
        <div className="page">
            <div className="login-wrapper">

                <div className="header">
                    <div className="header-main">
                        <ChronoCareLogo className="logo-inline" />
                        <h1 className="app-name">ChronoCare</h1>
                    </div>
                    <p className="subtitle">Chronic Disease Management Platform</p>
                </div>

                <UserTypeToggle userType={userType} setUserType={setUserType} />

                <LoginForm userType={userType} />
            </div>
        </div>
    );
}