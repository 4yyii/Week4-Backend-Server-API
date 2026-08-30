# Todo API Spec

## Create Todo

Endpoint : POST `/api/:userId/todo`

Request Body :

```json
{
    "title": "Reading a book",
    "description": "Read The Intelligent Investor book By Benjamin Graham",
    "status": "ACTIVE"
}
```

Response Body (Success - 201 Created) :

```json
{
    "message": "Todo added success",
    "data": {
        "id": 1,
        "title": "Reading a book",
        "description": "Read The Intelligent Investor book By Benjamin Graham",
        "status": "ACTIVE"
    }
}
```

Response Body (Failed - 400 Bad Request) :

```json
{
    "message": "Validation Error",
    "errors": {
        "status": "Invalid option: expected one of \"FINISH\"|\"ACTIVE\""
    }
}
```

---

## Get All Todos

Endpoint : GET `/api/todos`

Response Body (Success - 201 Created) :

```json
{
    "data": [
        {
            "id": 1,
            "title": "Reading a book",
            "description": "Read The Intelligent Investor book By Benjamin Graham",
            "status": "ACTIVE"
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

## Get Todo By Id

Endpoint : GET `/api/todos/:todoId`

Response Body (Success - 201 Created) :

```json
{
    "data": {
        "id": 1,
        "title": "Reading a book",
        "description": "Read The Intelligent Investor book By Benjamin Graham",
        "status": "ACTIVE",
        "user": {
            "id": 1,
            "name": "ayi",
            "email": "ayi@gmail.com",
            "phone": "08123456"
        }
    }
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 1 not found"
    }
}
```

---

## Update Todo

Endpoint : PATCH `/api/:userId/todo/:todoId`

Request Body :

```json
{
    "title": "Reading a book",
    "description": "Read The Intelligent Investor book By Benjamin Graham",
    "status": "FINISH"
}
```

Response Body (Success - 201 Created) :

```json
{
    "message": "Todo updated success",
    "data": {
        "id": 1,
        "title": "Reading a book",
        "description": "Read The Intelligent Investor book By Benjamin Graham",
        "status": "FINISH"
    }
}
```

Response Body (Failed - 400 Bad Request) :

```json
{
    "message": "Validation Error",
    "errors": {
        "title": "Too small: expected string to have >=1 characters"
    }
}
```

---

## Delete Todo

Endpoint : DELETE `/api/:userId/todo/:todoId`

Response Body (Success - 201 Created) :

```json
{
    "message": "Todo deleted success"
}
```

Response Body (Failed - 404 Not Found) :

```json
{
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 1 not found"
    }
}
```
