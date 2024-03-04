<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

# Finance-Tracker Nest.js

Welcome to our Nest.js project! This project is built using [Nest.js](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. Below you will find instructions on setting up the project environment and running migrations.

## Setup

To set up this project locally, please follow these steps:

1. **Clone the repository to your local machine:**

   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project_directory>
   ```

3. **Create a .env file in the root directory of the project with the following content:**

   ```env
   JWT_SECRET=<your-secret>
   DB_HOST=localhost
   DB_PORT=5432
   POSTGRES_USER=<your_postgres_username>
   POSTGRES_PASSWORD=<your_postgres_password>
   POSTGRES_DB=<your_database_name>
   ```

   Replace `<your_postgres_username>`, `<your_postgres_password>`, `<your_database_name>` with your actual PostgreSQL credentials and `<your-secret>` with a secure secret.

   You can generate a secret by running the following command in your terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Start the PostgreSQL Docker container:**

   Ensure you have Docker and Docker Compose installed on your machine. Then, run the following command to start the PostgreSQL Docker container:

   ```bash
   docker-compose -p cbs-postgresql up -d
   ```

This command will start a Docker container with PostgreSQL using the settings defined in your `docker-compose.yml` file.

````

## Running Migrations

To run migrations and set up your database schema, follow these steps:

1. **Install dependencies by running:**

   ```bash
   npm install
   ```

2. **Run the migrations:**

   ```bash
   npm run db:migrate
   ```

   This command will execute all pending migrations and apply changes to your database schema.

## Database Scripts

We have provided few scripts for interacting with the database:

1. `dump-database.sh`: This script creates a data dump of the database.
2. `import-database.sh`: This script creates a backup dump of the current data in the database and then imports the data from the data dump.
3. `restore-database.sh`: This script imports the data dump from the backup created when importing in case the import script failed.

Before running these scripts, make sure to set your database credentials in a `.env` file, after which you can run the scripts with:

```bash
npm run db:dump
```

```bash
npm run db:import
```

```bash
npm run db:restore
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

Nest is [MIT licensed](LICENSE).
````
