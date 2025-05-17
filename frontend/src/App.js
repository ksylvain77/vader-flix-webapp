import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import PlexLibrary from './components/PlexLibrary';
import Auth from './components/Auth';
import SimpleTest from './components/SimpleTest';

function App() {
  console.log('App component rendering'); // Debug log

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Vader Flix</h1>
          <p>Your personal media dashboard</p>
          <nav>
            <Link to="/">Home</Link> | 
            <Link to="/auth">Auth</Link> | 
            <Link to="/plex">Plex</Link> | 
            <Link to="/simple">Simple Test</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/plex" element={<PlexLibrary />} />
            <Route path="/simple/*" element={<SimpleTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;