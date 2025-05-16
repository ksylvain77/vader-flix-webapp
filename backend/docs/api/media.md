# Media Endpoints

## Get All Media
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

## Get Single Media
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

## Create Media (Admin Only)
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

## Update Media (Admin Only)
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

## Delete Media (Admin Only)
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