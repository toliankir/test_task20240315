## Description

Test task 20240315

## Installation

Configure .env file, .env.example already compatible with local environment.

Run database migrations

```bash
npm run db:migrate
```

Install dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Default endpoints

* http://127.0.0.1/api-doc - Swagger
* http://127.0.0.1/queues - Bull dashboard

## Stay in touch

- Author - [Anatolii Vasyliev](https://anatolii.vasyliev.name)
