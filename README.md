# Restaurant API with Elysia and Bun

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
```

Open http://localhost:3333/ with your browser to see the result.
