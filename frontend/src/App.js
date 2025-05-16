import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import PlexLibrary from './components/PlexLibrary';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Vader Flix</h1>
          <p>Your personal media dashboard</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plex" element={<PlexLibrary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;