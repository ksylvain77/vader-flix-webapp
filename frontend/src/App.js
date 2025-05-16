import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import TokenTest from './components/TokenTest';

function App() {
  useEffect(() => {
    const socket = io('http://192.168.50.92:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header" style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome to Vader Flix</h1>
        <p>Your personal media streaming platform</p>
      </header>
      <React.Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <TokenTest />
        </ErrorBoundary>
      </React.Suspense>
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
        <div style={{ padding: '20px', color: 'red' }}>
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