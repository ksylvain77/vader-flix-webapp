# Sonarr Integration API

## Endpoints

### Search TV Shows
```http
GET /api/sonarr/search
```

Query Parameters:
- `query` (required): Search term for TV shows

Response:
```json
[
  {
    "title": "Show Title",
    "tvdbId": 123456,
    "year": 2024,
    "images": [
      {
        "coverType": "poster",
        "url": "http://..."
      }
    ]
  }
]
```

### Get All TV Shows
```http
GET /api/sonarr/shows
```

Response:
```json
[
  {
    "title": "Show Title",
    "status": "continuing",
    "images": [
      {
        "coverType": "poster",
        "url": "http://..."
      }
    ]
  }
]
```

### Add TV Show
```http
POST /api/sonarr/shows
```

Request Body:
```json
{
  "tvdbId": 123456
}
```

Response:
```json
{
  "title": "Show Title",
  "status": "continuing",
  "images": [...]
}
```

### Get Download Queue
```http
GET /api/sonarr/queue
```

Response:
```json
{
  "records": [
    {
      "title": "Show Title",
      "episode": "S01E01",
      "status": "downloading"
    }
  ]
}
```

### Get System Status
```http
GET /api/sonarr/status
```

Response:
```json
{
  "version": "3.0.0",
  "startTime": "2024-05-17T18:00:00Z",
  "appName": "Sonarr"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Search query is required"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to fetch shows"
}
``` 