module.exports = {
    containerPrefix: process.env.CONTAINER_PREFIX || 'vader-flix',
    nasIp: process.env.NAS_IP || '192.168.50.92',
    nasUser: process.env.NAS_USER || 'kevin',
    nasSshPort: parseInt(process.env.NAS_SSH_PORT || '22', 10),
    projectPath: process.env.NAS_PROJECT_PATH || '/volume1/docker/projects/vader-flix-webapp'
}; 