import React from 'react';
import './App.css';
import PlexTokenTest from './components/PlexTokenTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Vader Flix</h1>
        <p>Your personal media dashboard</p>
      </header>
      <main>
        <PlexTokenTest />
      </main>
    </div>
  );
}

export default App;