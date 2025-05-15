const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const db = require("./models");
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");
}).catch(err => {
  console.log("Failed to sync database: " + err.message);
});

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vader Flix API' });
});

// Routes
require('./routes/auth.routes')(app);
require('./routes/media.routes')(app);
require('./routes/request.routes')(app);

// Set port and listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});