# Todo API Spec

## Create Todo

Endpoint : POST `/api/todos`

Request Body :

```json
{
    "title": "Learn Security Analysis",
    "description": "Security Analysis book is created by Benjamin Graham",
    "status": "In Progress",
    "userId": "66b96c4d8f5dc56dc98e15e6"
}
```

Response Body (Success - 201 Created) :

```json
{
    "status": "Success",
    "message": "Create todo success",
    "data": {
        "_id": "66ba4eca319273b7ddf19dba",
        "title": "Learn Security Analysis",
        "description": "Security Analysis book is created by Benjamin Graham",
        "status": "In Progress",
        "userId": "66b96c4d8f5dc56dc98e15e6",
        "createdAt": "2026-08-16T14:05:00.000Z",
        "updatedAt": "2026-08-16T14:05:00.000Z",
        "__v": 0
    }
}
```

Response Body (Failed - 400 Bad Request) :

```json
{
    "status": "Failed",
    "message": "Validation Error",
    "errors": {
        "status": "Invalid option: expected one of \"Pending\"|\"In Progress\"|\"Completed\""
    }
}
```

---

## Get All Todos

Endpoint : GET `/api/todos`

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "data": [
        {
            "_id": "66ba4eca319273b7ddf19dba",
            "title": "Learn Security Analysis",
            "description": "Security Analysis book is created by Benjamin Graham",
            "status": "In Progress",
            "userId": "66b96c4d8f5dc56dc98e15e6",
            "createdAt": "2026-08-16T14:05:00.000Z",
            "updatedAt": "2026-08-16T14:05:00.000Z",
            "__v": 0
        }
    ]
}
```

Response Body (Failed - 500 Internal Server Error) :

```json
{
    "errors": "Internal Server Error"
}
```

---

## Get Todo By Id

Endpoint : GET `/api/todos/:todoId`

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "data": {
        "_id": "66ba4eca319273b7ddf19dba",
        "title": "Learn Security Analysis",
        "description": "Security Analysis book is created by Benjamin Graham",
        "status": "In Progress",
        "userId": {
            "_id": "66b96c4d8f5dc56dc98e15e6",
            "name": "ayi",
            "email": "ayi@example.com",
            "phone": "08123456",
            "createdAt": "2026-08-16T14:00:00.000Z",
            "updatedAt": "2026-08-16T14:00:00.000Z",
            "__v": 0
        },
        "createdAt": "2026-08-16T14:05:00.000Z",
        "updatedAt": "2026-08-16T14:05:00.000Z",
        "__v": 0
    }
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "status": "Failed",
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 66ba4eca319273b7ddf19dba not found"
    }
}
```

---

## Update Todo

Endpoint : PATCH `/api/todos/:todoId`

Request Body :

```json
{
    "title": "Learn The Richest Man in Babylon",
    "description": "One of the best book in the world",
    "status": "Completed"
}
```

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "message": "Update success",
    "data": {
        "_id": "66ba4eca319273b7ddf19dba",
        "title": "Learn The Richest Man in Babylon",
        "description": "One of the best book in the world",
        "status": "Completed",
        "userId": "66b96c4d8f5dc56dc98e15e6",
        "createdAt": "2026-08-16T14:05:00.000Z",
        "updatedAt": "2026-08-16T14:12:00.000Z",
        "__v": 0
    }
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "status": "Failed",
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 66ba4eca319273b7ddf19dba not found"
    }
}
```

---

## Delete Todo

Endpoint : DELETE `/api/todos/:todoId`

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "message": "Delete Success"
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "status": "Failed",
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 66ba4eca319273b7ddf19dba not found"
    }
}
```
