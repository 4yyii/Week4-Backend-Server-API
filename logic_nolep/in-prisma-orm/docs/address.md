# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:idContact/addresses

Request Header :
- X-API-TOKEN : token

Request Body : 

```json
{
    "street" : "What a street",
    "city" : "What a city",
    "province" : "What a province",
    "country" : "What a country",
    "postal_code" : "12345"
}
```

Response Body (Success) :

```json
{
    "status" : "Success",
    "message" : "Create address success",
    "data" : {
        "id" : 1,
        "street" : "What a street",
        "city" : "What a city",
        "province" : "What a province",
        "country" : "What a country",
        "postal_code" : "12345"
    }
}
```
Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "postal_code": "Too small: expected string to have >=1 characters"
    }
}
```

## Get Address

Endpoint : GET /api/contacts/:idContact/addresses/:idAddress

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
    "status" : "Success",
    "message" : "Get address success",
    "data" : {
        "id" : 1,
        "street" : "What a street",
        "city" : "What a city",
        "province" : "What a province",
        "country" : "What a country",
        "postal_code" : "12345"
    }
}
```

Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "address": "Address is not found"
    }
}
```

## Update Address

Endpoint : PUT /api/contacts/:idContact/addresses/:idAddress

Request Header :
- X-API-TOKEN : token

Request Body : 

```json
{
    "street" : "What a street",
    "city" : "What a city",
    "province" : "What a province",
    "country" : "What a country",
    "postal_code" : "12345"
}
```

Response Body (Success) :

```json
{
    "status" : "Success",
    "message" : "Update address success",
    "data" : {
        "id" : 1,
        "street" : "What a street",
        "city" : "What a city",
        "province" : "What a province",
        "country" : "What a country",
        "postal_code" : "12345"
    }
}
```
Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "street": "Too small: expected string to have >=1 characters"
    }
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:idContact/addresses/:idAddress

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
    "status" : "Success",
    "message" : "Remove address success"
}
```
Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "address": "Address is not found"
    }
}
```

## List Address

Endpoint : GET /api/contacts/:idContact/addresses

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
    "data" : [
        {
            "id" : 1,
            "street" : "What a street",
            "city" : "What a city",
            "province" : "What a province",
            "country" : "What a country",
            "postal_code" : "12345"
        },
        {
            "id" : 2,
            "street" : "What a street",
            "city" : "What a city",
            "province" : "What a province",
            "country" : "What a country",
            "postal_code" : "12345"
        }
    ]
}
```
Response Body (Failed) :

```json
{
    "status" : "Failed",
    "message" : "Validation Error",
    "errors" : {
        "message": "Unauthorized, ..."
    }
}
```