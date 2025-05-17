const authRoutes = require('./auth.routes');
const mediaRoutes = require('./media.routes');
const requestRoutes = require('./request.routes');

function setupRoutes(app) {
    authRoutes(app);
    mediaRoutes(app);
    requestRoutes(app);
}

module.exports = setupRoutes; 