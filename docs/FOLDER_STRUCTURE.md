# VaderFlix Project Structure

## Root Directory
```
vader-flix-webapp/
├── .git/                  # Git repository
├── .gitignore            # Git ignore rules
├── .DS_Store             # macOS system file
├── README.md             # Project documentation
├── docker-compose.yml    # Docker compose configuration
├── config/               # Homepage dashboard configuration
├── docs/                 # Project documentation
└── portal/              # VaderFlix portal application
```

## Configuration Directory (`config/`)
```
config/
├── bookmarks.yaml       # Dashboard bookmarks configuration
├── custom.css          # Custom CSS styles
├── services.yaml       # Service configurations
├── settings.yaml       # Dashboard settings
└── widgets.yaml        # Dashboard widgets configuration
```

## Documentation Directory (`docs/`)
```
docs/
├── CHECKPOINT.md       # Project state checkpoint
├── CONFIG_BACKUP.md    # Legacy configuration backup
└── TROUBLESHOOTING.md  # Troubleshooting guide
```

## Portal Directory (`portal/`)
```
portal/
├── Dockerfile          # Portal container configuration
├── package.json        # Node.js dependencies
├── pending.json        # Pending requests data
├── server.js           # Main application server
├── users.json          # User data storage
└── public/            # Static web files
    ├── index.html     # Main portal page
    ├── login.html     # Login page
    ├── signup.html    # Signup page
    └── styles.css     # Portal styles
```

## Key Files Description

### Root Level
- `docker-compose.yml`: Defines the Homepage Dashboard and VaderFlix Portal services
- `README.md`: Main project documentation
- `.gitignore`: Specifies files to ignore in version control

### Configuration Files
- `config/bookmarks.yaml`: Dashboard bookmark configurations
- `config/custom.css`: Custom styling for the dashboard
- `config/services.yaml`: Service integration settings
- `config/settings.yaml`: Dashboard general settings
- `config/widgets.yaml`: Dashboard widget configurations

### Portal Files
- `portal/server.js`: Express.js server implementation
- `portal/package.json`: Node.js project configuration and dependencies
- `portal/Dockerfile`: Container configuration for the portal
- `portal/public/*`: Static web files for the portal interface

### Documentation Files
- `docs/CHECKPOINT.md`: Current project state and recent changes
- `docs/CONFIG_BACKUP.md`: Legacy configuration reference
- `docs/TROUBLESHOOTING.md`: Common issues and solutions

## Notes
- The `.git` directory contains version control information
- `.DS_Store` files are macOS system files and can be ignored
- The `portal-data` directory is created at runtime for data persistence 