// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/Auth';
import ChatPage from './pages/Chat';
import './App.css'; // Global CSS

// Component to handle redirection based on auth status
const AuthWrapper: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Or a full-page spinner
  }

  return isAuthenticated ? <Navigate to="/chat" replace /> : <AuthPage />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes with redirect if already logged in */}
          <Route path="/" element={<AuthWrapper />} />
          <Route path="/login" element={<AuthWrapper />} />
          <Route path="/signup" element={<AuthWrapper />} />

          {/* Protected routes */}
          <Route path="/chat" element={<PrivateRoute />}>
            <Route index element={<ChatPage />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App;