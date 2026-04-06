# Todo API Spec

## Create Todo

Endpoint : POST /api/:userId/todo

Request Body :

```
{
    "title": "Reading a book",
    "description": "Read The Intelligent Investor book By Benjamin Graham",
    "status": "ACTIVE"
}
```

Response Body (Success) :

```
{
    "message": "Todo added success",
    "data": {
        "id": 3,
        "title": "Reading a book",
        "description": "Read The Intelligent Investor book By Benjamin Graham",
        "status": "ACTIVE"
    }
}
```

Response Body (Failed) :

```
{
    "message": "Validation Error",
    "errors": {
        "status": "Invalid option: expected one of \"FINISH\"|\"ACTIVE\""
    }
}
```

## Get Todo

Endpoint : GET /api/todos

Response Body (Success) :

```
{
    "data": [
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
```

Response Body (Failed) :

```
{
    "message": "Internal Server Error"
}
```

## Get Todo By Id

Endpoint : GET /api/todos/:todoId

Response Body (Success) :

```
{
    "data": {
        "id": 3,
        "title": "Reading a book",
        "description": "Read The Intelligent Investor book By Benjamin Graham",
        "status": "ACTIVE",
        "user": {
            "id": 4,
            "name": "ayi",
            "email": "ayi@gmail.com",
            "phone": "08123456"
        }
    }
}
```

Response Body (Failed) :

```
{
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 4 not found"
    }
}
```

## Update Todo

Endpoint : PATCH /api/:userId/todo/:todoId

Request Body :

```
{
    "title": "Reading a book",
    "description": "Read The Intelligent Investor book By Benjamin Graham",
    "status": "FINISH"
}
```

Response Body (Success) :

```
{
    "message": "Todo updated success",
    "data": {
        "id": 3,
        "title": "Reading a book",
        "description": "Read The Intelligent Investor book By Benjamin Graham",
        "status": "FINISH"
    }
}
```

Response Body (Failed) :

```
{
    "message": "Validation Error",
    "errors": {
        "title": "Too small: expected string to have >=1 characters"
    }
}
```

## Delete Todo

Endpoint : DELETE /api/:userId/todo/:todoId

Response Body (Success) :

```
{
    "message": "Todo deleted success"
}
```

Response Body (Failed) :

```
{
    "message": "Not found",
    "errors": {
        "todo": "Todo with id 3 not found"
    }
}
```
