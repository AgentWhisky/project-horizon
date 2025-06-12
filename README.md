# Project Horizon

A full-stack web application built using Angular, NestJS, and PostgreSQL. 

## Libraries & Tools

### Frontend
- **[Angular 19](https://angular.io/)** – Main framework for building the app
- **[Angular Material](https://material.angular.io/)** – UI component library
- **[TailwindCSS](https://tailwindcss.com/)** - Utility classes for fast, flexible styling

### Backend
- **[NestJS 11](https://nestjs.com/)** – TypeScript-based Node.js framework
- **[TypeORM](https://typeorm.io/)** – ORM for PostgreSQL

### Infrastructure
- **Docker** – Containerization
- **Heroku** – Deployment platform
- **Cloudflare** – DNS & SSL/TLS management
- **PostgreSQL** – Relational database

---

## Authentication

Custom authentication system using **JWT (JSON Web Tokens)**:

- **Access Tokens**: Short-lived tokens used for authenticated requests.
- **Refresh Tokens**: Automatically issued and rotated on expiry.
- **Auto Refresh Logic**:
  - Angular interceptors detect token expiration and transparently fetch a new token using the refresh token.
- **Guards & Role Protection**: NestJS guards restrict access based on roles and rights.

---

## Development

- **Separate** Frontend and Backend allows for replacing either at any time

## Deployment

- **Frontend** and **Backend** run in separate Docker containers.
- **Heroku** hosts both containers using a multi-app setup.
- **Cloudflare** handles:
  - DNS resolution
  - SSL with Full (Strict) mode and TLS ≥1.3
  - CDN caching and performance optimization

---

## Database - PostgreSQL

- Schema defined and managed via TypeORM migrations
- B-Tree and GIN indexes on tables for efficient searching
- Utilizes Partitioned tables for commonly split data

---

## Project Structure




## Contact

- **GitHub**: [your-username](https://github.com/your-username)  
- **LinkedIn**: [your-name](https://www.linkedin.com/in/your-name)

---
**© 2025 Horizon** - Feel free to use or contribute under the terms of the [MIT License](./LICENSE).
