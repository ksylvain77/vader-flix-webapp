import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Auth = () => {
    console.log('Auth component rendering'); // Debug log
    const location = useLocation();
    const navigate = useNavigate();
    const isSignup = location.pathname === '/auth/signup';

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        console.log('Auth component mounted'); // Debug log
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', username); // Debug log
        try {
            const response = await axios.post('http://192.168.50.92:3000/api/auth/signin', { username, password });
            setToken(response.data.accessToken);
            setMessage('Login successful!');
            // Store the token in localStorage
            localStorage.setItem('token', response.data.accessToken);
            // Redirect to dashboard after successful login
            navigate('/');
        } catch (error) {
            console.error('Login error:', error); // Debug log
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log('Signup attempt with:', username); // Debug log
        try {
            const response = await axios.post('http://192.168.50.92:3000/api/auth/signup', { username, email, password });
            setMessage('Signup successful! Please login.');
            // Redirect to login page after successful signup
            navigate('/auth');
        } catch (error) {
            console.error('Signup error:', error); // Debug log
            setMessage(error.response?.data?.message || 'Signup failed.');
        }
    };

    return (
        <div className="auth-container" style={{
            maxWidth: '400px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '100%',
            position: 'relative',
            zIndex: 1
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#333',
                marginBottom: '20px'
            }}>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={isSignup ? handleSignup : handleLogin} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    <label style={{ color: '#666' }}>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                    />
                </div>
                {isSignup && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                    }}>
                        <label style={{ color: '#666' }}>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                )}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    <label style={{ color: '#666' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <button 
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    {isSignup ? 'Sign Up' : 'Login'}
                </button>
            </form>
            {message && (
                <p style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: message.includes('successful') ? '#e6ffe6' : '#ffe6e6',
                    borderRadius: '4px',
                    color: message.includes('successful') ? '#006600' : '#cc0000'
                }}>
                    {message}
                </p>
            )}
            {token && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    wordBreak: 'break-all'
                }}>
                    <p style={{ margin: '0', color: '#666' }}>Token:</p>
                    <code style={{ fontSize: '12px' }}>{token}</code>
                </div>
            )}
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                {isSignup ? (
                    <a href="/auth" style={{ color: '#007bff', textDecoration: 'none' }}>Already have an account? Login</a>
                ) : (
                    <a href="/auth/signup" style={{ color: '#007bff', textDecoration: 'none' }}>Need an account? Sign up</a>
                )}
            </div>
        </div>
    );
};

export default Auth; 