# NestJS Microservices: admin-service and gateway-service

This project encompasses two microservices: admin-service, which provides an API for managing users, and gateway-service, which acts as a unified entry point, proxying requests to the admin-service.

## Prerequisites

[Node.js](https://nodejs.org/es/) (v14+ recommended)
npm or yarn

## .env vars 🔧

You have a .env.dev with all the variables. You can modify if you need

## Installation 🔧

Clone the repo

```
git clone https://github.com/lucasgalarce/gateway-service.git
```

Install YARN packages

```
yarn install
yarn start:dev
```

Also, you need to run the other [gateway-service](https://github.com/lucasgalarce/gateway-service) repository.

And in the postman folder you have a file to import into the Postman app

## Usage

Once both services are up:

Use gateway-service as the entry point:

curl http://localhost:8080/v1/gateway-service/users or curl http://localhost:8080/v1/gateway-service/tasks

This request will be proxied over to the admin-service.

## Documentation

Swagger is running on: http://localhost:3000/v1/admin-service/docs
