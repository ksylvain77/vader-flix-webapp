import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import PlexLibrary from './components/PlexLibrary';
import Auth from './components/Auth';
import SimpleTest from './components/SimpleTest';
import Sonarr from './components/Sonarr';

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
        <header className="App-header">
          <h1>Vader Flix</h1>
          <p>Your personal media dashboard</p>
          <nav>
            {isAuthenticated() && (
              <>
                <Link to="/">Home</Link> | 
                <Link to="/plex">Plex</Link> | 
                <Link to="/sonarr">Sonarr</Link> | 
                <Link to="/simple">Simple Test</Link>
              </>
            )}
          </nav>
        </header>
        <main>
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
      </div>
    </Router>
  );
}

export default App;