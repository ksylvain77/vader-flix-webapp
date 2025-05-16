# Vader Flix Refactoring Roadmap

This document outlines the planned refactoring and improvements for the Vader Flix project, organized by priority.

## Should Do (Immediate Priority)

### 1. Configuration Management
- [ ] Consolidate configuration files
- [ ] Move sensitive data to environment variables
- [ ] Create a single source of truth for configuration

### 2. Backend Organization
- [ ] Split `server.js` into modules
- [ ] Properly integrate WebSocket logic
- [ ] Organize controllers and routes more effectively

### 3. Error Handling
- [ ] Implement centralized error handling
- [ ] Add error boundaries in frontend
- [ ] Standardize error responses across the API

### 4. Security
- [ ] Review JWT implementation
- [ ] Add rate limiting for all endpoints
- [ ] Implement proper CORS configuration
- [ ] Add security headers

## Do Right After That (Short-term Priority)

### 1. Frontend Structure
- [ ] Implement feature-based folder structure
- [ ] Add `pages` directory for route-level components
- [ ] Add `utils/helpers` directory for shared functions

### 2. Docker Configuration
- [ ] Consolidate Docker configurations
- [ ] Move `restart-docker.sh` to `scripts` directory
- [ ] Standardize Docker setup across environments

### 3. State Management
- [ ] Implement state management solution
- [ ] Add caching for Plex data
- [ ] Implement proper loading states

### 4. Development Workflow
- [ ] Add pre-commit hooks
- [ ] Implement proper linting
- [ ] Add development/production environment separation

## Nice to Haves (Long-term Goals)

### 1. Testing Structure
- [ ] Add frontend tests
- [ ] Add integration tests for Plex integration
- [ ] Implement better test organization
- [ ] Add end-to-end tests

### 2. Documentation
- [ ] Add architecture documentation
- [ ] Create development setup guide
- [ ] Add contributing guidelines
- [ ] Implement API versioning strategy

### 3. Code Quality
- [ ] Add TypeScript for better type safety
- [ ] Implement proper logging system
- [ ] Add performance monitoring
- [ ] Add code coverage reporting

### 4. Dependencies
- [ ] Review and update outdated dependencies
- [ ] Consider using a monorepo tool (Lerna/Nx)
- [ ] Implement proper dependency management

## Notes
- This roadmap is a living document and will be updated as priorities change
- Each item should be implemented with proper testing and documentation
- Security-related items should be reviewed regularly
- Performance impact should be measured before and after each major change

## Progress Tracking
- Use checkboxes to track completed items
- Add dates and notes for completed items
- Document any blockers or dependencies
- Update priorities as needed 