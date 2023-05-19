# NodeJS Web Services Application

In this application, I will share with you a process that takes place in the background of a simple social media application. You can perform GET, POST, PUT and DELETE operations with the web services I have developed using the Node JS library of the Javascript language. Below are the instructions you need to do to run the application.

## Service Reference

#### Install Instruction
```http
npm i
```

#### Start Application
```http
node index.js
```
#### Listening Server: http://localhost:2023


#### GET Example

```http
  GET /uyeler
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `uyeler` | `string` | **List Uyeler** |

#### POST Example

```http
  POST /paylasim
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `paylasim`      | `string` | **New paylasim** |



#### PUT Example

```http
  PUT /paylasim/:paylasim_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `paylasim_id`      | `integer` | **Update paylasim** |

#### PUT Example

```http
  DELETE /paylasim/:paylasim_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `paylasim_id`      | `integer` | **Delete paylasim** |

