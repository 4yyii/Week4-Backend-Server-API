# User API Spec

## Create User

Endpoint : POST `/api/users`

Request Body :

```json
{
    "name": "ayi",
    "email": "ayi@example.com",
    "phone": "08123456"
}
```

Response Body (Success - 201 Created) :

```json
{
    "status": "Success",
    "message": "Register success, welcome ayi",
    "data": {
        "_id": "66b96c4d8f5dc56dc98e15e6",
        "name": "ayi",
        "email": "ayi@example.com",
        "phone": "08123456",
        "createdAt": "2026-08-16T14:00:00.000Z",
        "updatedAt": "2026-08-16T14:00:00.000Z",
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
        "name": "Name already exist"
    }
}
```

---

## Get All Users

Endpoint : GET `/api/users`

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "data": [
        {
            "_id": "66b96c4d8f5dc56dc98e15e6",
            "name": "ayi",
            "email": "ayi@example.com",
            "phone": "08123456",
            "createdAt": "2026-08-16T14:00:00.000Z",
            "updatedAt": "2026-08-16T14:00:00.000Z",
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

## Get User By Id

Endpoint : GET `/api/users/:userId`

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "data": {
        "_id": "66b96c4d8f5dc56dc98e15e6",
        "name": "ayi",
        "email": "ayi@example.com",
        "phone": "08123456",
        "createdAt": "2026-08-16T14:00:00.000Z",
        "updatedAt": "2026-08-16T14:00:00.000Z",
        "__v": 0,
        "todos": [
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
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "status": "Failed",
    "message": "Not found",
    "errors": {
        "user": "User with id 66b96c4d8f5dc56dc98e15e6 not found"
    }
}
```

---

## Update User

Endpoint : PATCH `/api/users/:userId`

Request Body :

```json
{
    "name": "dudung",
    "email": "dudung@example.com",
    "phone": "08123456789"
}
```

Response Body (Success - 200 OK) :

```json
{
    "status": "Success",
    "message": "Update success",
    "data": {
        "_id": "66b96c4d8f5dc56dc98e15e6",
        "name": "dudung",
        "email": "dudung@example.com",
        "phone": "08123456789",
        "createdAt": "2026-08-16T14:00:00.000Z",
        "updatedAt": "2026-08-16T14:10:00.000Z",
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
        "user": "User with id 66b96c4d8f5dc56dc98e15e6 not found"
    }
}
```

---

## Delete User

Endpoint : DELETE `/api/users/:userId`

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
        "user": "User with id 66b96c4d8f5dc56dc98e15e6 not found"
    }
}
```
