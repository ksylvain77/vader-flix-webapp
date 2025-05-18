# Vader Flix Baseline Test Plan

## Purpose
This document outlines the test plan for establishing a baseline of the current Vader Flix system functionality. This baseline will serve as a reference point before implementing new features and improvements.

## Test Environment
- Local development environment
- Docker containers running:
  - Frontend (port 3001)
  - Backend (port 3000)
  - Database (port 3306)

## Test Areas

### 1. Authentication System
- [ ] User Registration
  - Test valid user registration
  - Test duplicate username/email
  - Test invalid input validation
  - Test password requirements

- [ ] User Login
  - Test valid credentials
  - Test invalid credentials
  - Test JWT token generation
  - Test token expiration

### 2. Plex Integration
- [ ] Library Access
  - Test library browsing
  - Test media search
  - Test metadata display
  - Test content filtering

- [ ] Media Playback
  - Test Plex web player integration
  - Test playback controls
  - Test quality settings
  - Test playback history

### 3. Media Request System
- [ ] Request Creation
  - Test new media request
  - Test request validation
  - Test duplicate request handling
  - Test request metadata

- [ ] Request Management
  - Test request status updates
  - Test request filtering
  - Test request history
  - Test user request limits

### 4. WebSocket Functionality
- [ ] Connection
  - Test WebSocket connection
  - Test connection stability
  - Test reconnection handling
  - Test connection limits

- [ ] Real-time Updates
  - Test status updates
  - Test notification delivery
  - Test message handling
  - Test error handling

### 5. Error Handling
- [ ] API Errors
  - Test 400 errors (bad requests)
  - Test 401 errors (unauthorized)
  - Test 404 errors (not found)
  - Test 500 errors (server errors)

- [ ] Client Errors
  - Test network errors
  - Test timeout handling
  - Test invalid data handling
  - Test error message display

### 6. Logging System
- [ ] Log Generation
  - Test error logging
  - Test info logging
  - Test debug logging
  - Test log rotation

- [ ] Log Access
  - Test log file creation
  - Test log file permissions
  - Test log file size management
  - Test log filtering

## Test Data Requirements
1. Test user accounts (admin, regular user)
2. Sample media items in Plex
3. Sample media requests
4. Test API keys and tokens

## Success Criteria
- All core functionality works as documented
- Error handling provides meaningful feedback
- Logging captures all necessary information
- WebSocket connections are stable
- API responses are consistent

## Test Execution
1. Run tests in isolation
2. Document any failures or unexpected behavior
3. Capture screenshots or logs of issues
4. Note performance metrics
5. Document any workarounds needed

## Reporting
For each test:
- Test name
- Expected result
- Actual result
- Pass/Fail status
- Notes/Issues
- Screenshots (if applicable)
- Logs (if applicable)

## Next Steps
After establishing the baseline:
1. Document any critical issues found
2. Prioritize fixes for broken functionality
3. Create tickets for improvements
4. Plan implementation of new features

## Notes
- This is a living document
- Update as new test cases are identified
- Maintain test data separately
- Document any environment-specific requirements 