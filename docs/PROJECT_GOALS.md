# Vader Flix Project Goals

## Core Vision
Create a unified media management and delivery system that integrates Plex, Sonar, Radar, and Qubit Torrent to provide a seamless media request and consumption experience.

## System Components

### 1. Access Management
- [x] User registration system
- [x] Admin authorization system
- [ ] Access request via link system
- [ ] Email notifications for access requests
- [ ] Access level management (viewer, requester, admin)

### 2. Media Search & Discovery
- [x] Plex library integration
- [x] Global search across libraries
- [ ] Sonar integration for TV shows
- [ ] Radar integration for movies
- [ ] Search result prioritization (Plex first, then Sonar/Radar)

### 3. Media Consumption
- [x] Plex web app integration for playback
- [ ] Direct playback for authorized users
- [ ] Playback history tracking
- [ ] Continue watching functionality

### 4. Media Request System
- [x] Basic request system
- [ ] Sonar/Radar integration for requests
- [ ] Automatic Qubit Torrent integration
- [ ] Request status tracking
- [ ] Notification system for completed downloads

### 5. Integration Status

#### Plex Integration
- [x] Library browsing
- [x] Media search
- [x] Basic metadata display
- [ ] Playback integration
- [ ] User access management

#### Sonar Integration
- [ ] API integration
- [ ] TV show search
- [ ] Request handling
- [ ] Status tracking

#### Radar Integration
- [ ] API integration
- [ ] Movie search
- [ ] Request handling
- [ ] Status tracking

#### Qubit Torrent Integration
- [ ] API integration
- [ ] Download management
- [ ] Progress tracking
- [ ] Completion notifications

## User Experience Goals

### For Viewers
- [x] Easy access to existing media
- [ ] Simple request process for new media
- [ ] Clear status updates on requests
- [ ] Seamless playback experience

### For Administrators
- [x] User management
- [ ] Request approval system
- [ ] Download monitoring
- [ ] System health monitoring

### Admin Dashboard
- [ ] Container Health Monitoring
  - [ ] Status of all Docker containers
  - [ ] Resource usage (CPU, Memory, Disk)
  - [ ] Log viewing and filtering
  - [ ] Container restart capabilities

- [ ] User Management Interface
  - [ ] View all users and their roles
  - [ ] Approve/reject access requests
  - [ ] Manage user permissions
  - [ ] User activity logs

- [ ] System Status
  - [ ] Plex server status
  - [ ] Sonar/Radar health checks
  - [ ] Qubit Torrent status
  - [ ] Download queue monitoring
  - [ ] Storage space monitoring

- [ ] Request Management
  - [ ] View all media requests
  - [ ] Approve/reject requests
  - [ ] Track download progress
  - [ ] Manual download triggers
  - [ ] Request history and statistics

- [ ] System Configuration
  - [ ] API key management
  - [ ] Service connection settings
  - [ ] Notification preferences
  - [ ] System backup/restore

## Technical Goals

### Security
- [x] JWT authentication
- [ ] Role-based access control
- [ ] Secure API integrations
- [ ] Rate limiting

### Performance
- [x] Efficient search
- [ ] Caching system
- [ ] Load balancing
- [ ] Resource optimization

### Reliability
- [ ] Error handling
- [ ] Automatic retries
- [ ] System monitoring
- [ ] Backup systems

## Future Enhancements
- [ ] Mobile app
- [ ] Multiple server support
- [ ] Advanced analytics
- [ ] Custom notification system
- [ ] Automated media organization

## Notes
- This is a living document that will be updated as features are implemented
- Priority is given to core functionality before enhancements
- Security and reliability are paramount
- User experience should be intuitive and seamless 