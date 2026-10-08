# Deploying to Render

This repository includes a Render Blueprint in `render.yaml`. In Render, create a new
Blueprint and select this repository. Set the prompted environment variables:

- `MONGO_DB_URL`: your MongoDB Atlas connection string.
- `IPINFO_TOKEN`: your ipinfo.io token.

Do not commit either value. The Blueprint builds the Vite frontend, starts the Express
server, and checks `/healthz`.

In MongoDB Atlas, allow connections from Render (Render's outbound IPs are not fixed on
all plans) and use a database user with only the permissions the app needs. Do not set
`MONGO_DNS_SERVERS` to a local/private DNS address in Render.

For local development, copy `.env.example` to `.env` and set the same values. Run
`npm ci`, `npm run build`, and `npm start` from the repository root.
