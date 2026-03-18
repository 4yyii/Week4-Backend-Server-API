# Todo API Spec

## Create Todo

Endpoint : POST /api/todos

Request Body :

```json
{
    "title": "Learn Security Analysis",
    "description": "Security Analysis book is created by Benjamin Graham",
    "status": "In Progress"
}
```

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message": "Create todo success",
    "data": {
        "title": "Learn Security Analysis",
        "description": "Security Analysis book is created by Benjamin Graham",
        "status": "In Progress",
        "_id": "69ba4eca319273b7ddf19dba", // as todoId
        "__v": 0
    }
}
```

Response Body (Failed) :

```json
{
    "status": "Failed",
    "message": "Validation Error",
    "errors": {
        "status": "Invalid option: expected one of \"Pending\"|\"In Progress\"|\"Completed\""
    }
}
```

## Update Todo

Endpoint : PATCH /api/todos/:todoId

Request Body :

```json
{
    "title": "Learn The Richest Man in Babylon",
    "description": "One of the best book in the world",
    "status": "Completed"
}
```

Response Body (Success) : 

```json
{
    "status": "Success",
    "message": "Update success",
    "data": {
        "title": "Learn The Richest Man in Babylon",
        "description": "One of the best book in the world",
        "status": "Completed"
    }
}
```

Response Body (Failed) :

```json
{
    "status": "Failed",
    "message": "Validation Error",
    "errors": {
        "status": "Invalid option: expected one of \"Pending\"|\"In Progress\"|\"Completed\""
    }
}
```

## Delete Todo

Endpoint : DELETE /api/todos/:todoId

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
    "status": "Failed",
    "message": "Not found",
    "errors": {
        "todo": "Todo not found"
    }
}
```
