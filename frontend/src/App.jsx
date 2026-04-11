import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfilePage from './pages/PatientProfilePage';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/setup-profile" element={<PatientProfilePage />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;