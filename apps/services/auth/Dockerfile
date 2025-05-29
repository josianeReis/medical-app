FROM oven/bun:latest AS base
WORKDIR /app

# Install infisical for secrets management
RUN apt-get update && apt-get install -y bash curl && curl -1sLf \
    'https://artifacts-cli.infisical.com/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y infisical

# Install moon binary
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://moonrepo.dev/install/moon.sh | bash && \
    echo 'export PATH="/root/.moon/bin:$PATH"' >> ~/.bashrc && \
    export PATH="/root/.moon/bin:$PATH"

ENV PATH="/root/.moon/bin:$PATH"

# Verify moon is installed
RUN moon --version 
RUN echo "moon installed"


#### SKELETON STAGE
#### Scaffolds repository skeleton structures.

FROM base AS skeleton

ENV NODE_ENV=production

# Copy entire repository and scaffold
COPY . .
RUN moon docker scaffold auth

#### BUILD STAGE
#### Builds the project.

FROM base AS build

ENV NODE_ENV=production

# Copy toolchain
COPY --from=skeleton /root/.proto /root/.proto

# Copy workspace configs
COPY --from=skeleton /app/.moon/docker/workspace .

# Install dependencies
RUN moon docker setup

# Copy project sources
COPY --from=skeleton /app/.moon/docker/sources .

# Build the project
RUN moon run auth:build

# Prune extraneous dependencies
RUN moon docker prune

#### START STAGE

# FROM gcr.io/distroless/base AS start
FROM base AS start

WORKDIR /app

# COPY --from=build /root/.proto /root/.proto
COPY --from=build /app/apps/services/auth/server server
COPY --from=build /app/apps/services/auth/start.sh start.sh

ARG API_PORT
ENV API_PORT=$API_PORT
ENV NODE_ENV=production

CMD ["infisical", "run", "--projectId", "8411663e-b8b4-41c6-ad95-a6852cc7853c","--env", "prod", "--",  "./server" ]
# CMD ["./start.sh"]
EXPOSE $API_PORT
