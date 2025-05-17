import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import PlexLibrary from './components/PlexLibrary';
import Auth from './components/Auth';
import SimpleTest from './components/SimpleTest';
import Sonarr from './components/Sonarr';
import Navbar from './components/Navbar';

function App() {
  console.log('App component rendering'); // Debug log

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated()) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated() && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/signup" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/plex" element={
              <ProtectedRoute>
                <PlexLibrary />
              </ProtectedRoute>
            } />
            <Route path="/sonarr" element={
              <ProtectedRoute>
                <Sonarr />
              </ProtectedRoute>
            } />
            <Route path="/simple/*" element={
              <ProtectedRoute>
                <SimpleTest />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </main>

        <style>{`
          .App {
            min-height: 100vh;
            background-color: #f5f5f5;
          }

          .main-content {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .main-content {
              padding: 10px;
            }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;