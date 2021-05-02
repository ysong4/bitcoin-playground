# Bitcoin Playground

The `frontend` and `backend` are two separate apps.

The `frontend` contains the final version of the app. It is a `create-react-app` generated project, all validation and business logic happen on frontend. It is my own implementation to generate address.

The `backend` is my first implementation of the app, it is a backend server written in NestJS (all logic on backend) and it provide a swagger for user to interactive with it. It is using `hdkey` and `bitcoinjs-lib` to generate address.

## How to run?

### Run the latest version of the app

```
cd frontend
yarn install
yarn start
```

Then, you can visit the app on http://localhost:3000

### Run the backend version of the app

```
cd backend
yarn install
yarn start
```

Then, you can visit the API swagger on http://localhost:3000/api

