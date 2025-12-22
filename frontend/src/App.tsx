import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthProfile from './pages/HealthProfile';
import ProgressCapture from './pages/ProgressCapture';
import PlanPage from './pages/PlanPage';
import ProgressHistory from './pages/ProgressHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Layout Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<HealthProfile />} />
          <Route path="/capture" element={<ProgressCapture />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/history" element={<ProgressHistory />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
