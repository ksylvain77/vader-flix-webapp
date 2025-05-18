# VaderFlix Configuration Backup

This document is a backup of all configuration values required for VaderFlix to run Sonarr, Radarr, and Plex integrations using modern libraries (`@jc21/sonarr-api`, `@jc21/radarr-api`, `@ctrl/plex` or `plexjs`).

---

## Sonarr Configuration

| Variable                     | Example Value                                          | Purpose                                |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------- |
| SONARR\_BASE\_URL            | [http://192.168.50.92:8989](http://192.168.50.92:8989) | Base URL for Sonarr API                |
| SONARR\_API\_KEY             | 8709f14bd30d4924bc76349878a1a06f                       | Sonarr API Key                         |
| SONARR\_QUALITY\_PROFILE\_ID | 1                                                      | Default quality profile ID             |
| SONARR\_ROOT\_FOLDER\_PATH   | /data/media/tv                                         | Default TV storage path                |
| SONARR\_SEASON\_FOLDER       | true                                                   | Use season folders for TV shows        |
| SONARR\_MONITORED            | true                                                   | Monitor shows by default               |
| SONARR\_SEARCH\_MISSING      | false                                                  | Search for missing episodes by default |

---

## Radarr Configuration

| Variable                     | Example Value                                          | Purpose                              |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------ |
| RADARR\_BASE\_URL            | [http://192.168.50.92:7878](http://192.168.50.92:7878) | Base URL for Radarr API              |
| RADARR\_API\_KEY             | 1796ecf4c4f244bfa6b7db47c6e271b0                       | Radarr API Key                       |
| RADARR\_QUALITY\_PROFILE\_ID | 1                                                      | Default quality profile ID           |
| RADARR\_ROOT\_FOLDER\_PATH   | /data/media/movies                                     | Default movies storage path          |
| RADARR\_MONITORED            | true                                                   | Monitor movies by default            |
| RADARR\_SEARCH\_MISSING      | false                                                  | Search for missing movies by default |

---

## Plex Configuration

| Variable                    | Example Value                                            | Purpose                                |
| --------------------------- | -------------------------------------------------------- | -------------------------------------- |
| PLEX\_BASE\_URL             | [http://192.168.50.92:32400](http://192.168.50.92:32400) | Base URL for Plex Media Server         |
| PLEX\_TOKEN                 | <your-token-here>                                        | Plex authentication token              |
| PLEX\_LIBRARY\_SECTION\_IDS | 1,2,3                                                    | Comma-separated library IDs (optional) |
| PLEX\_USERNAME              | <your-username>                                          | Plex username (for token retrieval)    |
| PLEX\_PASSWORD              | <your-password>                                          | Plex password (for token retrieval)    |

---

## Notes

* All config variables should be stored in a `.env` file, Docker Compose, or secret management system.
* Values here are EXAMPLES. Do not share real tokens or passwords.
* If any config is changed, update this file for future reference.
* Additional variables may be required for future features; update as needed.
