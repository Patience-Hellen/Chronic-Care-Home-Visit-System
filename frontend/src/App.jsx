import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from './pages/LoginPage';

// (we'll create these later)
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  return (
    <Router>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards */}
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      </Routes>
    </Router>
  );
}

export default App;