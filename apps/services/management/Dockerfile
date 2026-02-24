FROM oven/bun:latest AS base
WORKDIR /app

# Install infisical for secrets management
RUN apt-get update && apt-get install -y bash curl wget sudo && curl -1sLf \
    'https://artifacts-cli.infisical.com/setup.deb.sh' | sudo -E bash \
    && sudo apt-get update && sudo apt-get install -y infisical

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
RUN moon docker scaffold management

#### BUILD STAGE
#### Builds the project.
FROM base AS build

ENV NODE_ENV=production

# Copy toolchain
COPY --from=skeleton /root/.proto /root/.proto

# Copy workspace configs
COPY --from=skeleton /app/.moon/docker/workspace .

# Copy project sources
COPY --from=skeleton /app/.moon/docker/sources .

# Build the project
RUN moon run management:build


#### START STAGE
FROM base AS start

WORKDIR /app

COPY --from=build /app/apps/services/management/server server

ARG API_PORT
ENV API_PORT=$API_PORT
ENV NODE_ENV=production

CMD ["sh", "-c", "infisical run --token $INFISICAL_TOKEN --projectId $INFISICAL_PROJECT_ID --env $INFISICAL_ENV --path $INFISICAL_PATH -- ./server"]

EXPOSE $API_PORT
