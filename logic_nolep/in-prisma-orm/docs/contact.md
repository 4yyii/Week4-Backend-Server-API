# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :
- X-API-TOKEN : token

Request Body : 

```json
{
    "first_name" : "Ayi",
    "last_name" : "Khannedy",
    "email" : "ayi@example.com",
    "phone" : "08123456"
}
```

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Create contact success",
    "data" : {
        "id" : 1,
        "first_name" : "Ayi",
        "last_name" : "Khannedy",
        "email" : "ayi@example.com",
        "phone" : "08123456"
    }
}
```

Response Body (Failed) : 

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "first_name": "Too small: expected string to have >=1 characters"
    }
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Get contact success, here the data",
    "data" : {
        "id" : 1,
        "first_name" : "Ayi",
        "last_name" : "Khannedy",
        "email" : "ayi@example.com",
        "phone" : "08123456"
    }
}
```

Response Body (Failed) : 

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "id" : "Contact not found"
    }
}
```

## Update Contact

Endpoint : PUT /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Request Body : 

```json
{
    "first_name" : "Ayi",
    "last_name" : "Khannedy",
    "email" : "ayi@example.com",
    "phone" : "08123456"
}
```

Response Body (Success) : 

```json
{
    "status" : "Succes",
    "message" : "Update contact success",
    "data" : {
        "id" : 1,
        "first_name" : "Ayi",
        "last_name" : "Khannedy",
        "email" : "ayi@example.com",
        "phone" : "08123456"
    }
}
```

Response Body (Failed) : 

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "first_name": "Too small: expected string to have >=1 characters"
    }
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Response Body (Success) : 

```json
{
    "status" : "Success",
    "message" : "Remove contact success"
}
```

Response Body (Failed) : 

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "id": "Contact not found"
    }
}
```

## Search Contact

Endpoint : GET /api/contacts

Query Parameter :
- name : string, contact first name or contact last name, optional
- phone : string, contact phone, optional
- email : string, contact email, optional
- page : number, default 1
- size : number, default 10

Request Header :
- X-API-TOKEN : token

Response Body (Success) : 

```json
{
    "data" : [
        {
            "id" : 1,
            "first_name" : "Ayi",
            "last_name" : "Khannedy",
            "email" : "ayi@example.com",
            "phone" : "08123456"
        },
        {
            "id" : 2,
            "first_name" : "Ayi",
            "last_name" : "Khannedy",
            "email" : "ayi@example.com",
            "phone" : "08123456"
        }
    ],
    "pagging" : {
        "current_page" : 1,
        "total_page" : 10,
        "size" : 10
    }
}
```

Response Body (Failed) : 

```json
{
    "errors" : "Unauthorized, ..."
}
```