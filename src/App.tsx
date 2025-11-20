import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/chatbot" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppointmentsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;