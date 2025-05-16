import React from 'react';
import TokenTest from './components/TokenTest';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome to Vader Flix</h1>
        <p>Your personal media streaming platform</p>
      </header>
      <TokenTest />
    </div>
  );
}

export default App;