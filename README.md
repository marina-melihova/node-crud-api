# CRUD API (TypeScript with Node.js)

See task [description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md).

## How to install

Clone and install packages

```
npm ci
```

## How to run

Run the application in production mode:

```
npm run start:prod
```

Run the application in development mode:

```
npm run start:dev
```

Run cluster mode with load balancer and one in-memory database for all workers

```
npm run start:multi
```

Run test scenarios for API:

```
npm test
```

Use the following endpoints to interact with REST-service by postman:

#### - Create a new user:

##### POST /api/users

| Name         | Required | Type     | Request |
| :----------- | :------: | :------- | :------ |
| **username** | required | string   | body    |
| **age**      | required | number   | body    |
| **hobbies**  | required | string[] | body    |

#### - Get all users:

##### GET /api/users

#### - Get user by ID:

##### GET /api/users/:id

| Name   | Required | Type | Request |
| :----- | :------: | :--: | :------ |
| **id** | required | uuid | params  |

#### - Remove user:

##### DELETE /api/users/:id

| Name   | Required | Type | Request |
| :----- | :------: | :--: | :------ |
| **id** | required | uuid | params  |

#### - Update user:

##### PUT /api/users/:id

| Name         | Required |   Type   | Request |
| :----------- | :------: | :------: | :------ |
| **id**       | required |   uuid   | params  |
| **username** | optional |  string  | body    |
| **hobbies**  | optional | string[] | body    |
| **age**      | optional |  number  | body    |
