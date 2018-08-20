# my-diary-client
A web-based client (frontend) that consumes MyDiary API and interfaces users with the service. The API can be found at [https://my-diary-api.herokuapp.com/api/docs](https://my-diary-api.herokuapp.com/api/docs)

## Features

- Users can create an account and log in.
- User can view all entries to their diary.
- Users can view the contents of a diary entry.
- Users can add or modify an entry.
- Users can delete an entry
- Users can like an entry
- Users can view the journaling profile and performance

## Frameworks

- None - The goal of this project is to demonstrate how a modern frontend client can be built without any framework. Just pure HTML, CSS and Javascript.

## API Endpoints Consumed

| Endpoint                    | Functionality        |
| --------------------------- | -------------------- |
| POST `/auth/signup`         | Register a user      |
| POST `/auth/login`          | Login a user         |
| GET `/profile`              | Fetch user profile   |
| PUT `/profile`              | Update user profile  |
| GET `/entries`              | Fetch all entries    |
| GET `/entries/<entryId>`    | Fetch a single entry |
| POST `/entries`             | Create an entry      |
| PUT `/entries/<entryId>`    | Modify an entry      |
| DELETE `/entries/<entryId>` | Delete an entry      |


## Setup

- Clone repo and cd into directory

```
git clone https://github.com/olusoladavid/my-diary-client
```

- Install dependencies with `npm install`
- Point a web browser to `index.html`  to get started

## Live Demo

- [https://olusoladavid.github.io/my-diary-client](https://olusoladavid.github.io/my-diary-client)


## API Docs

- [https://my-diary-api.herokuapp.com/api/docs](https://my-diary-api.herokuapp.com/api/docs)

## License
- MIT