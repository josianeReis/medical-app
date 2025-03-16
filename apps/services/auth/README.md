# Auth Service

This service handles authentication and authorization for the Laudos platform.

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Moon CLI](https://moonrepo.dev/docs/install) installed

## Getting Started

### Environment Setup

⚠️ **IMPORTANT**: Before running any commands, make sure to set up your environment variables:

```bash
# Copy the example environment file
cp .env-example .env

# Edit .env with your specific configurations
```

### Development

Run the service in development mode with hot reload:

```bash
moon run auth:dev
```

The service will start with inspector enabled on port 4011.

### Building

Build the service:

```bash
moon run auth:build
```

### Production

Start the service in production mode:

```bash
moon run auth:start
```

## Additional Commands

### Generate Migrations

To create new database migrations:

```bash
moon run auth:migration-create
```

### Generate OpenAPI Documentation

Update the OpenAPI documentation:

```bash
moon run auth:openapi-generate
```

## Dependencies

This service depends on the following internal packages:
- data-access
- utils
- email-templates

Make sure these dependencies are properly set up before running the service.