# User API Spec

## Register User

Endpoint : POST `/api/user/register`

Request Body :

```json
{
    "name": "ayi",
    "email": "ayi@gmail.com",
    "phone": "08123456"
}
```

Response Body (Success - 201 Created) :

```json
{
    "message": "Register success, Welcome ayi",
    "data": {
        "id": 1,
        "name": "ayi",
        "email": "ayi@gmail.com",
        "phone": "08123456"
    }
}
```

Response Body (Failed - 400 Bad Request) :

```json
{
    "message": "Validation Error",
    "errors": {
        "name": "Name already exist"
    }
}
```

---

## Get User By Id

Endpoint : GET `/api/users/:userId`

Response Body (Success - 201 Created) :

```json
{
    "data": {
        "id": 1,
        "name": "ayi",
        "email": "ayi@gmail.com",
        "phone": "08123456",
        "todos": [
            {
                "id": 1,
                "title": "Reading a book",
                "description": "Read The Intelligent Investor book By Benjamin Graham",
                "status": "ACTIVE"
            }
        ]
    }
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "message": "Not found",
    "errors": {
        "user": "User with id 1 not found"
    }
}
```

---

## Get All Users

Endpoint : GET `/api/users`

Response Body (Success - 201 Created) :

```json
{
    "data": [
        {
            "id": 1,
            "name": "ayi",
            "email": "ayi@gmail.com",
            "phone": "08123456"
        }
    ]
}
```

Response Body (Failed - 500 Internal Server Error) :

```json
{
    "message": "Internal Server Error"
}
```

---

## Update User

Endpoint : PATCH `/api/user/:userId`

Request Body :

```json
{
    "name": "ayi updated",
    "email": "ayi@gmail.com",
    "phone": "08123456789"
}
```

Response Body (Success - 201 Created) :

```json
{
    "message": "Update user success with id 1",
    "data": {
        "id": 1,
        "name": "ayi updated",
        "email": "ayi@gmail.com",
        "phone": "08123456789"
    }
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "message": "Not found",
    "errors": {
        "user": "User with id 1 not found"
    }
}
```

---

## Delete User

Endpoint : DELETE `/api/user/:userId`

Response Body (Success - 201 Created) :

```json
{
    "message": "Delete user success with id 1"
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "message": "Not found",
    "errors": {
        "user": "User with id 1 not found"
    }
}
```
