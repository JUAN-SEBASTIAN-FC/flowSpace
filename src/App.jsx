import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Onboarding from './pages/auth/Onboarding';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Modules
import Appointments from './pages/appointments/Appointments';
import Clients from './pages/clients/Clients';
import Inventory from './pages/inventory/Inventory';
import Billing from './pages/billing/Billing';
import Reminders from './pages/reminders/Reminders';
import WhatsApp from './pages/whatsapp/WhatsApp';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* App routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}