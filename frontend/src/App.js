import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Vader Flix</h1>
        <p>Your personal media dashboard</p>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;