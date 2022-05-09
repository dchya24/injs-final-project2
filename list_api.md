# List API

## User

- ### Register

  - URL: _api/users/register_
  - Method: **POST**
  - Request
    - body
      | Key | Value |
      | ----------- | ----------- |
      | email | String, required |
      | password | String, required |
      | full_name | String, required |
      | username | String, required |
      | profile_image_url | String, required |
      | age | Integer, required |
      | phone_number | Integer, required |

  - Response
  
    ```json
    {
      "user": {
        "email": "string",
        "full_name": "string",
        "username": "string",
        "profile_image_url": "string",
        "age": "integer",
        "phone_number": "integer"
      }
    }
    ```

- ### Login

  - URL: _api/users/login_
  - Method: **POST**
  - Request
    - body
      | Key | Value |
      | ----------- | ----------- |
      | email | String, required |
      | password | String, required |

  - Response
  
    ```json
    {
      "token": "string", // jwt token
    }
    ```

- ### Update User

  - URL: _api/users/:id_
  - Method: **PUT**
  - Request
    - headers `x-acess-token` string token generate by `jwt`
    - params `:id` id from users
    - body
      | Key | Value |
      | ----------- | ----------- |
      | email | String, required |
      | full_name | String, required |
      | username | String, required |
      | profile_image_url | String, required |
      | age | Integer, required |
      | phone_number | Integer, required |

  - Response
  
    ```json
    {
      "user": {
        "email": "string",
        "full_name": "string",
        "username": "string",
        "profile_image_url": "string",
        "age": "integer",
        "phone_number": "integer"
      }
    }
    ```

- ### Delete User

  - URL: _api/users/:id_
  - Method: **DELEE**
  - Request
    - headers `x-acess-token` string token generate by `jwt`
    - params `:id` id from users
  - Response
  
    ```json
    {
      "message": "Your account has been successfully deleted"
    }
    ```

## Photo

- ### Get Photos

  - URL: _api/photos_
  - Method: **GET**
  - Request
    - headers `x-acess-token` string token generate by `jwt`
  - Response
  
    ```json
    {
      "photos": [
        {
          "id": "integer",
          "title": "string",
          "caption": "string",
          "poster_image_url": "string",
          "UserId": "integer",
          "createdAt": "timestamp",
          "updatedAt": "timestamp",
          "Comments": [],
          "User": {
              "id": "integer",
              "username": "test",
              "profile_image_url": "string"
          }
        }
      ]
    }
    ```
  
- ### Create Photo

  - URL: _api/photos_
  - Method: **POST**
  - Request
    - headers `x-acess-token` string token generate by `jwt`
    - body
      | Key | Value |
      | ----------- | ----------- |
      | poster_image_url | String, required |
      | title | String, required |
      | caption | String, required |

  - Response
  
    ```json
    {
      "id": "integer",
      "title": "string",
      "title": "string",
      "caption": "string",
      "poster_image_url": "string",
      "UserId": "integer"
    }
    ```

- ### Update Photo

  - URL: _api/photos/:id_
  - Method: **PUT**
  - Request
    - headers `x-acess-token` string token generate by `jwt`
    - params `:id` id from Photo
    - body
      | Key | Value |
      | ----------- | ----------- |
      | success | String, required |
      | low_point | String, required |
      | take_way | String, required |

  - Response
  
    ```json
    "photo": {
      "id": "integer",
      "title": "string",
      "title": "string",
      "caption": "string",
      "poster_image_url": "string",
      "UserId": "integer",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
    ```

- ### Delete Photo

  - URL: _api/photos/:id_
  - Method: **PUT**
  - Request
    - headers `x-acess-token` string token generate by `jwt`
    - params `:id` id from Photo
  - Response
  
    ```json
    {
      "message": "Your photo has been successfully deleted"
    }
    ```
