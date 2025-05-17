const authRoutes = require('./auth.routes');
const mediaRoutes = require('./media.routes');
const requestRoutes = require('./request.routes');
const sonarrRoutes = require('./sonarr.routes');
const radarrRoutes = require('./radarr.routes');

function setupRoutes(app) {
    authRoutes(app);
    mediaRoutes(app);
    requestRoutes(app);
    app.use('/api/sonarr', sonarrRoutes);
    app.use('/api/radarr', radarrRoutes);
}

module.exports = setupRoutes; 