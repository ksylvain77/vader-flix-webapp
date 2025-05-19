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

// Overseerr proxy middleware - with connection testing
const overseerrProxy = createProxyMiddleware({
    target: 'http://overseerr:5055',
    changeOrigin: true,
    pathRewrite: {
        '^/overseerr': '',
    },
    onError: (err, req, res) => {
        console.log('Overseerr proxy error:', err);
        res.send('<h1>Overseerr is not available</h1><p>Error: ' + err.message + '</p>');
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to Overseerr:', req.url);
    }
});

// Apply proxy only to /overseerr path
app.use('/overseerr', overseerrProxy);

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
    const transporter = nodemailer.createTransporter(emailConfig);
    
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

// Process login - ENHANCED WITH DEBUGGING
app.post('/login', async (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Login attempt started for user: ${req.body.username}`);
    console.log(`[${timestamp}] Session ID before login: ${req.sessionID}`);
    console.log(`[${timestamp}] Existing session data: ${JSON.stringify(req.session)}`);
    
    try {
        const { username, password } = req.body;
        
        const users = await readJSON('users.json');
        const user = users.find(u => u.username === username);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            console.log(`[${timestamp}] Login failed - invalid credentials for: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create session
        req.session.user = {
            username: user.username,
            email: user.email
        };
        
        console.log(`[${timestamp}] Session created successfully`);
        console.log(`[${timestamp}] Session ID after login: ${req.sessionID}`);
        console.log(`[${timestamp}] Session data after login: ${JSON.stringify(req.session)}`);
        
        // Force session save before responding
        req.session.save((err) => {
            if (err) {
                console.log(`[${timestamp}] Session save error: ${err}`);
                return res.status(500).json({ error: 'Session save failed' });
            }
            
            console.log(`[${timestamp}] Session saved successfully`);
            res.json({ success: true, redirect: '/portal' });
        });
        
    } catch (error) {
        console.error(`[${timestamp}] Login error:`, error);
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

// DEBUG SESSION STATUS - shows what's in the session
app.get('/debug-session', (req, res) => {
    res.send(`
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    background: #000; 
                    color: #fff; 
                    font-family: monospace; 
                    padding: 20px; 
                    line-height: 1.6;
                }
                .status { 
                    background: #333; 
                    padding: 15px; 
                    margin: 10px 0; 
                    border-radius: 5px; 
                }
                .good { border-left: 5px solid #0f0; }
                .bad { border-left: 5px solid #f00; }
                a { color: #0ff; }
            </style>
            <script>
                setTimeout(() => location.reload(), 5000);
            </script>
        </head>
        <body>
            <h1>VaderFlix Debug Panel</h1>
            <div class="status ${req.session && req.session.user ? 'good' : 'bad'}">
                <strong>Session Status:</strong> ${req.session && req.session.user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}
            </div>
            <div class="status">
                <strong>Session ID:</strong> ${req.sessionID || 'None'}
            </div>
            <div class="status">
                <strong>User Data:</strong> ${req.session && req.session.user ? JSON.stringify(req.session.user, null, 2) : 'None'}
            </div>
            <div class="status">
                <strong>Session Cookie:</strong> ${req.headers.cookie || 'None'}
            </div>
            <div class="status">
                <strong>Time:</strong> ${new Date().toISOString()}
            </div>
            <div style="margin-top: 30px;">
                <a href="/login">Go to Login</a> | 
                <a href="/portal">Go to Portal</a> | 
                <a href="/logout">Logout</a>
            </div>
            <p><em>Auto-refreshing every 5 seconds...</em></p>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`VaderFlix Media Portal running on port ${PORT}`);
    console.log(`Signup: http://localhost:${PORT}/signup`);
    console.log(`Login: http://localhost:${PORT}/login`);
});