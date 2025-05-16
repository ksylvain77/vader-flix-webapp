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

## API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
```
Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully!"
}
```

#### Sign In
```http
POST /api/auth/signin
```
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "accessToken": "string"
}
```

### Media

#### Get All Media
```http
GET /api/media
```
Retrieve all media items. Public endpoint.

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "type": "string",
    "url": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### Get Single Media
```http
GET /api/media/:id
```
Retrieve a specific media item by ID. Public endpoint.

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "type": "string",
  "url": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Create Media (Admin Only)
```http
POST /api/media
```
Create a new media item. Requires admin privileges.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "string",
  "url": "string"
}
```

**Response:**
Status: 201 Created
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "type": "string",
  "url": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Update Media (Admin Only)
```http
PUT /api/media/:id
```
Update an existing media item. Requires admin privileges.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "string",
  "url": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "type": "string",
  "url": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Delete Media (Admin Only)
```http
DELETE /api/media/:id
```
Delete a media item. Requires admin privileges.

**Response:**
```json
{
  "message": "Media deleted successfully"
}
```

### Content Requests

#### Create Request
```http
POST /api/requests
```
Create a new content request. Requires authentication.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "type": "string",
  "status": "string",
  "userId": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Get User Requests
```http
GET /api/user/requests
```
Get all requests made by the authenticated user.

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "type": "string",
    "status": "string",
    "userId": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### Get All Requests (Admin Only)
```http
GET /api/requests
```
Get all content requests. Requires admin privileges.

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "type": "string",
    "status": "string",
    "userId": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### Update Request Status (Admin Only)
```http
PUT /api/requests/:id/status
```
Update the status of a content request. Requires admin privileges.

**Request Body:**
```json
{
  "status": "string" // "pending", "approved", "rejected"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "type": "string",
  "status": "string",
  "userId": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Plex Integration

#### Get Plex Servers
```http
GET /api/plex/servers
```
Retrieve all available Plex servers. Requires authentication.

**Response:**
```json
[
  {
    "name": "string",
    "uri": "string",
    "accessToken": "string"
  }
]
```

#### Get Plex Libraries
```http
GET /api/plex/libraries
```
Retrieve all libraries from a Plex server. Requires authentication.

**Query Parameters:**
- `serverUri` (required): The URI of the Plex server

**Response:**
```json
[
  {
    "key": "string",
    "type": "string",
    "title": "string",
    "count": "number"
  }
]
```

#### Get Library Items
```http
GET /api/plex/libraries/:libraryKey/items
```
Retrieve all items from a specific library. Requires authentication.

**Query Parameters:**
- `serverUri` (required): The URI of the Plex server

**Response:**
```json
[
  {
    "ratingKey": "string",
    "key": "string",
    "title": "string",
    "year": "number",
    "type": "string",
    "summary": "string",
    "thumb": "string",
    "art": "string",
    "episodeCount": "number",
    "seasonCount": "number"
  }
]
```

## Error Responses

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