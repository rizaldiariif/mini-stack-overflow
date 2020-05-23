# Mini Stack Overflow

> Extremely simplified version of stack overflow

Mini stack overflow is a application to post question and wating answer from other user.
This application is built with:

- Typescript (For better readability and consistency)
- Express
- MongoDB
- NextJS

Developed with automated test using:

- Jest
- Supertest
- Mongodb Memory Server

## Progress

- [x] ~~Basic Express API Setup~~
- [x] ~~Middlewares~~
- [x] ~~Custom Error Handlers~~
- [x] ~~Authentication Route Functionality~~
- [x] ~~Authentication Route Testing~~
- [x] ~~Question Route Functionality~~
- [x] ~~Question Route Testing~~
- [x] Answer Route Functionality
- [ ] Answer Route Testing
- [ ] Basic NextJS Setup
- [ ] Client Auth Functionality
- [ ] Client Question Functionality
- [ ] Client Answer Functionality

## Quickstart

### Install dependencies

    npm install

### Run in Deployment mode

To run in deployment mode you have to set the environment variable of MONGO_URI and JWT_KEY first.

    MONGO_URI=
    JWT_KEY=

Then run the start command

    npm start

### Run in Demo mode

You can run this application without any further setup with this mode, but everytime it restarted the data will be deleted because in this mode the application is using mongodb memory server.

    npm run demo

### Run test

    npm run test
