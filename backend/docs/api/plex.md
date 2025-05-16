# Plex Integration Endpoints

## Get Plex Servers
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

## Get Plex Libraries
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

## Get Library Items
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