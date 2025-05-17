# Radarr Integration API

## Endpoints

### Search Movies
```http
GET /api/radarr/search
```

Query Parameters:
- `query` (required): Search term for movies

Response:
```json
[
  {
    "title": "Movie Title",
    "tmdbId": 123456,
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

### Get All Movies
```http
GET /api/radarr/movies
```

Response:
```json
[
  {
    "title": "Movie Title",
    "status": "released",
    "images": [
      {
        "coverType": "poster",
        "url": "http://..."
      }
    ]
  }
]
```

### Add Movie
```http
POST /api/radarr/movies
```

Request Body:
```json
{
  "tmdbId": 123456
}
```

Response:
```json
{
  "title": "Movie Title",
  "status": "released",
  "images": [...]
}
```

### Get Download Queue
```http
GET /api/radarr/queue
```

Response:
```json
{
  "records": [
    {
      "title": "Movie Title",
      "status": "downloading"
    }
  ]
}
```

### Get System Status
```http
GET /api/radarr/status
```

Response:
```json
{
  "version": "4.0.0",
  "startTime": "2024-05-17T18:00:00Z",
  "appName": "Radarr"
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
  "message": "Failed to fetch movies"
}
``` 