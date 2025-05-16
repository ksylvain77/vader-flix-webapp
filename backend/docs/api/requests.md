# Content Request Endpoints

## Create Request
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

## Get User Requests
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

## Get All Requests (Admin Only)
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

## Update Request Status (Admin Only)
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