# User API Spec

## Register User

Endpoint : POST /api/user/register

Request Body :

```
{
    "name" : "ayi",
    "email" : "ayi@gmail.com",
    "phone" : "08123456"
}
```

Response Body (Success) :

```
{
    "message": "Register success, Welcome ayi",
    "data": {
        "id": 3,
        "name": "ayi",
        "email": "ayi@gmail.com",
        "phone": "08123456"
    }
}
```

Response Body (Failed) :

```
{
    "message": "Validation Error",
    "errors": {
        "name": "Name already exist"
    }
}
```

## Get User By Id

Endpoint : GET /api/users/:userId

Response Body (Success) :

```
{
    "data": {
        "id": 4,
        "name": "ayi",
        "email": "ayi@gmail.com",
        "phone": "08123456",
        "todos": [
            {
                "id": 3,
                "title": "Reading a book",
                "description": "Read The Intelligent Investor book By Benjamin Graham",
                "status": "ACTIVE"
            },
            {
                "id": 4,
                "title": "Reading a book",
                "description": "Read The Intelligent Investor book By Benjamin Graham",
                "status": "ACTIVE"
            }
        ]
    }
}
```

Response Body (Failed) :

```
{
    "message": "Not found",
    "errors": {
        "user": "User with id 2 not found"
    }
}
```

## Get User

Endpoint : GET /api/users

Response Body (Success) :

```
{
    "data": [
        {
            "id": 3,
            "name": "ayi",
            "email": "ayi@gmail.com",
            "phone": "08123456"
        },
        {
            "id": 4,
            "name": "ayi",
            "email": "ayi@gmail.com",
            "phone": "08123456"
        }
    ]
}
```

Response Body (Failed) :

```
{
    "message": "Internal Server Error"
}
```

## Update User

Endpoint : PATCH /api/user/:userId

Request Body :

```
{
    "name": "ayi",
    "email": "ayi@gmail.com",
    "phone": "08123456"
}
```

Response Body (Success) :

```
{
    "message": "Update user success with id 3",
    "data": {
        "id": 3,
        "name": "ayi",
        "email": "ayi@gmail.com",
        "phone": "08123456"
    }
}
```

Response Body (Failed) :

```
{
    "message": "Not found",
    "errors": {
        "user": "User with id 4 not found"
    }
}
```

## Delete User

Endpoint : DELETE /api/user/:userId

Response Body (Success) :

```
{
    "message": "Delete user success with id 3"
}
```

Response Body (Failed) :

```
{
    "message": "Not found",
    "errors": {
        "user": "User with id 3 not found"
    }
}
```
