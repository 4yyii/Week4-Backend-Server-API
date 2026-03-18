# User API Spec

## Create User

Endpoint : POST /api/users

Request Body :

```json
{
    "name" : "ayi",
    "email" : "ayi@example.com",
    "phone" : "08123456" 
}
```

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Register success, welcome ayi",
    "data": {
        "name": "ayi",
        "_id": "ObjectId('69b96c4d8f5dc56dc98e15e6')", // as userId
        "email": "ayi@example.com",
        "phone": "08123456",
        "__v": 0
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "name": "Name already exist"
    } 
}
```

## Update User

Endpoint : PATCH /api/users/:userId

Request Body :

```json
{
    "name" : "ayi",
    "email" : "ayi@example.com",
    "phone" : "08123456" 
}
```

Response Body (Success) : 

```json
{
    "status": "Success",
    "message": "Update success",
    "data": {
        "name": "dudung",
        "email": "dudung@example.com",
        "phone": "08123456",
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "name": "Name already exist"
    } 
}
```

## Delete User

Endpoint : DELETE /api/users/:userId

Response Body (Success) : 

```json
{
    "status": "Success",
    "message": "Delete success",
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "name": "Name not found"
    } 
}
```
