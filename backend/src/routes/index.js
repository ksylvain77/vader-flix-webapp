const authRoutes = require('./auth.routes');
const mediaRoutes = require('./media.routes');
const requestRoutes = require('./request.routes');
const sonarrRoutes = require('./sonarr.routes');

function setupRoutes(app) {
    authRoutes(app);
    mediaRoutes(app);
    requestRoutes(app);
    app.use('/api/sonarr', sonarrRoutes);
}

module.exports = setupRoutes; 