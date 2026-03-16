# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "ayi",
    "password" : "secret",
    "name" : "Ayi Khannedy" 
}
```

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Register success, welcome ayi",
    "data" : {
        "username" : "ayi",
        "name" : "Ayi Khannedy"
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "username": "Too small: expected string to have >=1 characters"
    } 
}
```

## Login User


Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "ayi",
    "password" : "secret"
}
```

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Login success, welcome ayi",
    "data" : {
        "name" : "Ayi Khannedy",
        "username" : "ayi",
        "token" : "jwt"
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "message": "Username or password wrong, ..."
    }
}
```

## Get User


Endpoint : GET /api/users/current

Request Header : 
- X-API-TOKEN : token

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Get user success, here the data",
    "data" : {
        "username" : "ayi",
        "name" : "Ayi Khannedy"
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "message" : "Unauthorized, ..."
    }
}
```

## Update User


Endpoint : PATCH /api/users/current

Request Header : 
- X-API-TOKEN : token

Request Body :

```json
{
    "password" : "secret",
    "name" : "Ayi Khannedy",
    "username" : "ayi" 
}
```

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Update user success, here the data",
    "data" : {
        "username" : "Ayi",
        "name" : "Ayi Khannedy"
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "message" : "Unauthorized, ..."
    }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header : 
- X-API-TOKEN : token

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Logout success"
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "message" : "Unauthorized, ..."
    }
}
```