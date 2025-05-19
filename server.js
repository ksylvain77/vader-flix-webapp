const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('./config');

const app = express();
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.json({ ok: true });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
}); 