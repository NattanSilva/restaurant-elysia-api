# Restaurant API with Elysia and Bun

The **Restaurant API** is a backend application built with **Bun** and **ElysiaJS**, designed to efficiently manage restaurants. The API provides RESTful endpoints documented via **OpenAPI**, making it easy to integrate with frontend applications or external services.

## 🔹 Features

- Create, read, update, and delete restaurants
- Interactive documentation via **OpenAPI**
- Integration tests
- User authentication and authorization with **Better Auth**  
- Database management via **Drizzle ORM**
- Docker compose to use 2 **PostgreSQL** databases(test and development)

## 🔹 Technologies Used

- **Bun**: fast JavaScript/TypeScript runtime
- **ElysiaJS**: minimalistic framework for building APIs
- **Better Auth**: secure user authentication  
- **Drizzle ORM**: type-safe database ORM 
- **OpenAPI**: standardized and automatic API documentation

## Development

To start the development server run:

```bash
# iniciate the docker postgres
docker compose down -v && docker compose up -d

# install dependencies
bun install

# create database tables
bun db:migrate

# start develop server server
bun run dev

# running integration tests(please run the migrations before this)
bun test:integration
```

## Integration Tests

To see all integration tests run:

```bash
# iniciate the docker postgres
docker compose down -v && docker compose up -d

# install dependencies
bun install

# create database tables
bun db:migrate

# running integration tests(please run the migrations before this)
bun test:integration
```

Open <code>http://localhost:3333</code> with your browser to see the result and use <code>http://localhost:3333/openapi</code> route to see the api documentation.
