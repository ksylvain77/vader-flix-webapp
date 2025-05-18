# Configuration Consolidation Plan

## Current State Analysis
The project currently has configuration scattered across multiple locations:
- `project.config` (root level)
- `.env` files (backend and frontend)
- Docker compose files
- Hardcoded values in various files

## Phase 1: Create New Configuration Structure

### 1.1 Directory Structure
```
backend/
└── config/
    ├── index.js              # Main configuration loader
    ├── schema.js             # Configuration validation schema
    ├── environments/
    │   ├── development.js    # Development environment config
    │   ├── production.js     # Production environment config
    │   └── test.js          # Test environment config
    └── services/
        ├── database.js       # Database configuration
        ├── auth.js          # Authentication configuration
        ├── plex.js          # Plex service configuration
        └── docker.js        # Docker-related configuration
```

### 1.2 Configuration Categories
1. **Core Application**
   - Server port
   - Environment (development/production/test)
   - Logging configuration
   - CORS settings

2. **Database**
   - Host
   - Port
   - Database name
   - Username
   - Password
   - Connection pool settings

3. **Authentication**
   - JWT secret
   - Token expiration
   - Password policies

4. **Services**
   - Plex configuration
   - Docker settings
   - NAS connection details

5. **Environment-Specific**
   - Development overrides
   - Production settings
   - Test configurations

## Phase 2: Implementation Steps

### 2.1 Create Base Configuration
1. Create the new directory structure
2. Implement the main configuration loader
3. Create configuration validation schema
4. Set up environment-specific configurations

### 2.2 Migration Steps
1. Create new configuration files without removing old ones
2. Implement configuration loader
3. Add validation
4. Test new configuration system
5. Gradually migrate services to new system
6. Remove old configuration files

### 2.3 Validation and Testing
1. Create configuration validation tests
2. Test all environment configurations
3. Verify all services work with new system
4. Document configuration requirements

## Phase 3: Documentation

### 3.1 Required Documentation
1. Configuration setup guide
2. Environment variable documentation
3. Service configuration guide
4. Troubleshooting guide

### 3.2 Example Files
1. `.env.example`
2. `config.example.js`
3. Docker compose examples

## Safety Measures

### 4.1 Backup Strategy
1. Create backup of all configuration files
2. Document current working configuration
3. Create rollback plan

### 4.2 Testing Strategy
1. Test in development environment first
2. Verify all services work with new configuration
3. Test in production-like environment
4. Create validation scripts

### 4.3 Rollback Plan
1. Document current configuration state
2. Create rollback scripts
3. Test rollback procedures

## Implementation Order

1. **Week 1: Setup and Planning**
   - Create new directory structure
   - Set up configuration loader
   - Create validation schema

2. **Week 2: Core Configuration**
   - Implement database configuration
   - Set up authentication configuration
   - Create environment-specific configs

3. **Week 3: Service Migration**
   - Migrate Plex configuration
   - Update Docker configuration
   - Implement NAS settings

4. **Week 4: Testing and Documentation**
   - Test all configurations
   - Create documentation
   - Verify in all environments

## Success Criteria

1. All configuration is centralized
2. No hardcoded sensitive data
3. Environment-specific configurations work
4. All services function correctly
5. Documentation is complete
6. Rollback procedures are tested

## Notes
- Each step should be implemented and tested before moving to the next
- Regular backups should be maintained throughout the process
- All changes should be documented
- Testing should be thorough before each deployment 