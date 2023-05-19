
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

