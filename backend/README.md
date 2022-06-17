CS 3083 Course Project
======

CS 3083 course project backend server.

## Development Server

```shell
yarn
yarn dev
```

## Production Deployment

### Database migration

```shell
mysql -u[user_name] -p [db_name] < migration/db.sql
```

### Build and run
```shell
yarn
yarn build
```

Then, run `yarn start` with correct environment variables to start the server.

## Environment Variables

| Key         | Default value (or required)           | Description                |
|:------------|:--------------------------------------|:---------------------------|
| PORT        | 3000                                  | The port of backend server |
| DB_HOST     | localhost                             | MySQL hostname             |
| DB_PORT     | 3306                                  | MySQL port                 |
| DB_USERNAME | Required                              | Database username          |
| DB_PASSWORD | Required                              | Database password          |
| DB_DATABASE | Required                              | Database name              |
| JWT_KEY     | s3cr3t (highly recommended to change) | JWT secret key             |
