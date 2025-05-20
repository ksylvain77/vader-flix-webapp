const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'vaderflix-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Overseerr proxy middleware
app.use('/overseerr', createProxyMiddleware({
    target: 'http://overseerr:5055',
    changeOrigin: true,
    pathRewrite: {
        '^/overseerr': '', // removes /overseerr from the forwarded path
    },
    timeout: 30000, // 30 second timeout
    onError: (err, req, res) => {
        console.log('Overseerr proxy error:', err);
        res.status(500).send(`
            <div style="background: #000; color: #ff0000; font-family: 'Orbitron', sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #ffd700;">Overseerr Temporarily Unavailable</h1>
                <p>The media request system is currently down. Please try again in a moment.</p>
                <a href="/portal" style="display: inline-block; background: #cc0000; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    RETURN TO PORTAL
                </a>
            </div>
        `);
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to Overseerr:', req.url);
    }
}));

// Email configuration
const emailConfig = {
    service: 'gmail',
    auth: {
        user: 'ksylvain77@gmail.com',
        pass: 'eovb ivbk nxka nacw'  // Replace with your Gmail App Password
    }
};

// Helper functions
async function readJSON(filename) {
    try {
        const filePath = path.join('/usr/src/app/data', filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeJSON(filename, data) {
    const filePath = path.join('/usr/src/app/data', filename);
    // Ensure the data directory exists
    await fs.mkdir('/usr/src/app/data', { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function sendVerificationEmail(email, username, token) {
    const transporter = nodemailer.createTransport(emailConfig);
    
    const verificationUrl = `http://vaderflix.synology.me:3001/verify/${token}`;
    
    const mailOptions = {
        from: emailConfig.auth.user,
        to: email,
        subject: 'Welcome to VaderFlix - Verify Your Account',
        html: `
            <div style="background: #000; color: #ff0000; font-family: 'Orbitron', sans-serif; padding: 20px;">
                <h1 style="color: #ffd700;">Welcome to VaderFlix, ${username}</h1>
                <p>Click the link below to verify your account and gain access to the Empire's media collection:</p>
                <a href="${verificationUrl}" style="display: inline-block; background: #cc0000; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    VERIFY ACCOUNT
                </a>
                <p style="color: #888;">Or copy this link: ${verificationUrl}</p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes

// Root route - redirect to login if not authenticated
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/portal');
    } else {
        res.redirect('/signup');
    }
});

// Signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Process signup
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const users = await readJSON('users.json');
        const pending = await readJSON('pending.json');
        
        if (users.find(u => u.username === username || u.email === email) ||
            pending.find(u => u.username === username || u.email === email)) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Add to pending users
        const newUser = {
            username,
            email,
            password: hashedPassword,
            verificationToken,
            createdAt: new Date().toISOString()
        };
        
        pending.push(newUser);
        await writeJSON('pending.json', pending);
        
        // Send verification email
        await sendVerificationEmail(email, username, verificationToken);
        
        res.json({ success: true, message: 'Verification email sent!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Email verification
app.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const pending = await readJSON('pending.json');
        const users = await readJSON('users.json');
        
        const userIndex = pending.findIndex(u => u.verificationToken === token);
        
        if (userIndex === -1) {
            return res.status(400).send('<h1>Invalid verification token</h1>');
        }
        
        // Move user from pending to verified
        const user = pending[userIndex];
        delete user.verificationToken; // Remove token
        user.verifiedAt = new Date().toISOString();
        
        users.push(user);
        pending.splice(userIndex, 1);
        
        await writeJSON('users.json', users);
        await writeJSON('pending.json', pending);
        
        res.send(`
            <div style="background: #000; color: #ff0000; font-family: 'Orbitron', sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #ffd700;">Account Verified Successfully!</h1>
                <p>Welcome to VaderFlix, ${user.username}!</p>
                <a href="/login" style="display: inline-block; background: #cc0000; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    LOGIN NOW
                </a>
            </div>
        `);
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('<h1>Verification failed</h1>');
    }
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Process login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const users = await readJSON('users.json');
        const user = users.find(u => u.username === username);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create session
        req.session.user = {
            username: user.username,
            email: user.email
        };
        
        res.json({ success: true, redirect: 'http://vaderflix.synology.me:5055' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Protected portal (your original content)
app.get('/portal', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to check auth status
app.get('/api/auth/status', (req, res) => {
    res.json({ 
        authenticated: !!(req.session && req.session.user),
        user: req.session?.user || null
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`VaderFlix Media Portal running on port ${PORT}`);
    console.log(`Signup: http://localhost:${PORT}/signup`);
    console.log(`Login: http://localhost:${PORT}/login`);
});