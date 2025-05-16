# Vader Flix API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the request header:
```
Authorization: Bearer <your_jwt_token>
```

## API Sections

- [Authentication](auth.md) - User registration and authentication endpoints
- [Media](media.md) - Media management endpoints
- [Content Requests](requests.md) - Content request system endpoints
- [Plex Integration](plex.md) - Plex server integration endpoints

## Common Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error message describing the issue"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized!"
}
```

### 403 Forbidden
```json
{
  "message": "Require Admin Role!"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting
API requests are limited to 100 requests per 15 minutes per IP address.

## CORS
The API supports Cross-Origin Resource Sharing (CORS) with the following headers:
- Access-Control-Allow-Headers: x-access-token, Origin, Content-Type, Accept 