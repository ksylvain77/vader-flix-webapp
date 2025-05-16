import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import TokenTest from './components/TokenTest';

function App() {
  const [socketStatus, setSocketStatus] = useState('disconnected');

  useEffect(() => {
    console.log('Attempting to connect to WebSocket server...');
    
    const socket = io('http://192.168.50.92:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      forceNew: true
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setSocketStatus('connected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setSocketStatus('error');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      setSocketStatus('disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setSocketStatus('error');
    });

    return () => {
      console.log('Cleaning up socket connection...');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <header style={{ 
          padding: "20px", 
          textAlign: "center",
          borderBottom: '1px solid #eee',
          marginBottom: '20px'
        }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>Welcome to Vader Flix</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>Your personal media streaming platform</p>
          <div style={{ 
            padding: '10px', 
            margin: '10px', 
            backgroundColor: socketStatus === 'connected' ? '#4CAF50' : 
                          socketStatus === 'error' ? '#f44336' : '#ff9800',
            color: 'white',
            borderRadius: '5px',
            display: 'inline-block'
          }}>
            WebSocket Status: {socketStatus}
          </div>
        </header>

        <main style={{ padding: '20px' }}>
          <React.Suspense fallback={
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px'
            }}>
              Loading components...
            </div>
          }>
            <ErrorBoundary>
              <TokenTest />
            </ErrorBoundary>
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}

// Error boundary for TokenTest
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error in TokenTest:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          color: 'red',
          backgroundColor: '#fff3f3',
          borderRadius: '5px',
          border: '1px solid #ffcdd2'
        }}>
          <h2>Error in TokenTest Component</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default App;