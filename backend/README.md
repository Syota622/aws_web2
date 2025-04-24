# Hono Docker Application

A simple Hono application using Docker and pnpm.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone this repository
2. Build and start the application:

```bash
docker-compose up --build
```

3. Access the API at http://localhost:3000
   - Root endpoint: `http://localhost:3000/`
   - Hello endpoint: `http://localhost:3000/api/hello/world`

## Development

### Without Docker

If you want to run the application locally without Docker:

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

### With Docker

The application uses Docker volumes, so changes to your code will be reflected immediately when running in development mode.

## Project Structure

```
.
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── src/                # Source code
│   └── index.ts        # Main application entry point
└── dist/               # Compiled JavaScript (generated)
```

## Technologies

- [Hono](https://hono.dev/) - Lightweight web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [Docker](https://www.docker.com/) - Containerization