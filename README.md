# Project Horizon

A flexible, full-stack tool platform built with Angular, NestJS, DiscordJS, and PostgreSQL.

## Project Overview

**Horizon** is a general-purpose tool application that combines several of my older standalone projects and new features into one unified platform.

Horizon serves as a foundation for experimenting with new features and adding utilities I find personally useful or interesting to build.

Some tools are powered by a full backend with API and database integration, while others are entirely client-side. Some tools even have extended functionaltiy into Discord with the `HorizonBot` Discord bot.

An admin-only section is available for managing backend-connected content, enabling controlled updates to data shown to users.

## Tech Stack Overview

### Web Application

- **[Angular 19](https://angular.io/)** – Main framework for building the app
- **[Angular Material](https://material.angular.io/)** – UI component library
- **[TailwindCSS](https://tailwindcss.com/)** - Utility classes for simple and fast CSS styling

### API Server

- **[NestJS 11](https://nestjs.com/)** – TypeScript-based Node.js framework
- **[TypeORM](https://typeorm.io/)** – ORM for PostgreSQL - handles models, migrations, and queries

### Discord Bot

- **[DiscordJS](https://discord.js.org/)** – Library for building bots that interact with the Discord API

### Infrastructure

- **[Heroku](https://www.heroku.com/)** – App hosting and deployment (using Docker)
- **[Cloudflare](https://www.cloudflare.com/)** – Handles DNS, HTTPS, and serves static assets via CDN
- **[PostgreSQL](https://www.postgresql.org)** – Primary data source

## Project Structure

The codebase is organized into a loosely-coupled monorepo, with each service living in its own isolated folder:

- **`/client`** – Angular application
- **`/server`** – NestJS API server
- **`/discord-bot`** – Discord bot powered by DiscordJS
- **`/resources`** – Miscellaneous project files, such as design assets, planning notes, code snippets, etc. (not deployed)

Each service is developed and deployed independently, allowing for flexible updates or replacements.

## Deployment

Each part of the stack is deployed independently using [akhileshns/heroku-deploy](https://github.com/AkhileshNS/heroku-deploy), with dedicated Docker containers per service:

- **Three services**:

  - `client` – Angular app built and served via NGINX with a custom `nginx.conf`
  - `server` – NestJS API server, runs directly as a Node app
  - `discord-bot` – DiscordJS bot, runs as a Node process

- **Docker setup**:

  - Each service has its own Dockerfile tailored to its runtime
  - The `client` uses a special Docker config instead of `.env`, unlike the others to utilize different angular environment configs during build
  - The `server` and `discord-bot` use Heroku-configured environment variables pulled from `.env`

- **Heroku Configuration**:

  - Each service is deployed to a separate Heroku app
  - Apps are grouped into a Heroku Pipeline for logical separation (`stage` and `prod`), though the pipeline itself isn’t actively used
  - The API Server uses the `Heroku Postgres` add-on (in both stage and prod)
    - On container startup, it automatically runs `typeorm migration:run` to apply any schema changes and data updates
  - **Custom domains** are configured for all web dynos (client + api)
    - Domains are registered and managed through Cloudflare

- **Dyno Types**:

  - `client` and `server` use **web dynos** (default option)
  - `discord-bot` uses a **worker dyno**, set during GitHub Actions deployment, as it does not accept web traffic directly

- **GitHub Actions Deployment**:

  - **6 workflows total**, each mapped to a specific service and environment
  - **Stage deployments** happen automatically on commit:
    ```yaml
    on:
      push:
        branches:
          - master
        paths:
          - 'client/**'
    ```
  - **Production deployments** are triggered manually:
    ```yaml
    on:
      workflow_dispatch:
    ```

- **Cloudflare** is used for:
  - DNS resolution
  - Full (Strict) SSL with TLS ≥1.3
  - CDN caching and performance optimization
  - Serves as the **CDN** for all uploaded/static media

## Authentication

Authentication is built around a custom **JWT (JSON Web Tokens)** system, designed primarily for admin access.

- **Access Tokens** – Short-lived, used for authenticated API requests
- **Refresh Tokens** – Automatically rotated and securely stored
- **Auto-Refresh Logic** – Auth wrapper functions handle token refresh manually, then retry the original request
- **Route Protection**:
  - **Frontend** – Route guards restrict access to admin-only sections
  - **API Server** – NestJS guards enforce role and permission checks on protected endpoints

## Database – PostgreSQL

PostgreSQL serves as the primary relational database, with schema changes managed through a mix of auto-generated and custom-written TypeORM migrations. Custom SQL is used where PostgreSQL-specific features (e.g. partitioning, advanced indexing) are required.

Below are database usage stats as of **2025-07-17**:

> | Table Name           | Rows    | Size      | Seq Scans | Index Scans |
> |----------------------|---------|-----------|-----------|--------------|
> | steam_apps_sfw       | 181,698 | 1375 MB   | 920       | 91,787       |
> | steam_apps_nsfw      | 7,753   | 70 MB     | 866       | 8,662        |
> | steam_update_logs    | 1,668   | 832 kB    | 11        | 0            |
> | links                | 60      | 128 kB    | 1,119     | 325          |
> | rights               | 5       | 96 kB     | 1,326     | 0            |
> | user_roles           | 3       | 88 kB     | 677       | 0            |
> | link_library_tags    | 199     | 88 kB     | 480       | 668          |
> | role_rights          | 6       | 88 kB     | 684       | 0            |
> | link_categories      | 20      | 80 kB     | 308       | 0            |
> | users                | 3       | 80 kB     | 753       | 0            |
> | roles                | 2       | 80 kB     | 690       | 0            |
> | link_tags            | 86      | 72 kB     | 496       | 1,144        |
> | user_logs            | 168     | 72 kB     | 0         | 0            |
> | migrations           | 31      | 64 kB     | 27        | 0            |
> | settings             | 1       | 64 kB     | 65        | 0            |
> | refresh_token        | 4       | 64 kB     | 220       | 0            |

- The `steam_apps` table is partitioned into `steam_apps_sfw` and `steam_apps_nsfw`, which handle large-scale game metadata.


- **Schema Management**:

  - Migrations are used for all structural changes, with support for both auto-generated and handcrafted SQL (especially for PostgreSQL-specific features not covered by TypeORM)

- **Indexes**:

  - B-Tree and GIN indexes are applied for performance on key query paths and full-text search

- **Advanced Features**:
  - **Partitioned tables** are used for datasets naturally split by key (ie. active, nsfw, etc)
  - **`jsonb` columns** are used frequently for flexible or nested data structures
  - **Array columns** (`text[]`, `int[]`, etc.) are used for fields that naturally support multiple values and allow for efficient `IN[]` queries

## Security

The project includes multiple layers of security, spanning edge protection, frontend safeguards, backend enforcement, and platform-level configuration.

### Edge Security (Cloudflare)

- **DNS & Domain Management** – All domains are registered and routed through Cloudflare
- **DDoS Protection** – Mitigates large-scale attacks before they reach the origin
- **Bot Protection** – Challenges automated traffic to prevent scraping and abuse
- **HTTPS Enforcement** – Full (Strict) SSL with TLS 1.3 required across all services

### Frontend Security

- **Route Guards** – Angular route protection restricts access to admin-only views
- **NGINX Security Headers** – Custom NGINX configuration sets critical headers like:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`

### API Security

- **Authentication & Authorization** – JWT-based system with role-based access control (RBAC)
- **Guarded Endpoints** – All protected routes in NestJS use guards to verify roles and rights
- **Error Sanitization** – Server responses avoid leaking internal stack traces or sensitive data
- **Rate Limiting** – Requests to the API are rate-limited to prevent abuse and brute-force attempts

## Contact

- **GitHub**: [AgentWhisky](https://github.com/AgentWhisky/)
- **LinkedIn**: [Tyler Harris](https://www.linkedin.com/in/tyler-harris-495112181/)

---

**© 2025 Horizon** - Feel free to use under the terms of the [MIT License](./LICENSE).
