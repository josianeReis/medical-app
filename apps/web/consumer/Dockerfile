FROM oven/bun:latest AS base
WORKDIR /app

# Install infisical for secrets management
RUN apt-get update && apt-get install -y bash curl wget && curl -1sLf \
    'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y infisical

# Install moon binary
RUN apt-get update && apt-get install -y curl  && \
    curl -fsSL https://moonrepo.dev/install/moon.sh | bash && \
    echo 'export PATH="/root/.moon/bin:$PATH"' >> ~/.bashrc && \
    export PATH="/root/.moon/bin:$PATH"

ENV PATH="/root/.moon/bin:$PATH"

# Verify moon is installed
RUN moon --version
RUN echo "moon installed"

FROM base AS skeleton
# Copy entire repository and scaffold
COPY . .
RUN moon docker scaffold consumer

FROM base AS build

# Copy toolchain
COPY --from=skeleton /root/.proto /root/.proto

# Copy workspace configs
COPY --from=skeleton /app/.moon/docker/workspace .

# Install dependencies
RUN moon docker setup

# Copy project sources
COPY --from=skeleton /app/.moon/docker/sources .

# Build the project
RUN moon run consumer:build

# Prune extraneous dependencies
# RUN moon docker prune

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

COPY --from=build /app/apps/web/consumer/public ./apps/web/consumer/public

# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=build --chown=nextjs:nodejs /app/apps/web/consumer/.next/standalone ./
# COPY --from=build --chown=nextjs:nodejs /app/apps/web/consumer/.next/static ./.next/static
# COPY --from=build --chown=nextjs:nodejs /app/apps/web/consumer/.next ./.next
# COPY --from=build /root/.proto /root/.proto
# COPY --from=build /app/apps/web/consumer/.next/standalone/node_modules ./node_modules
COPY --from=build /app/apps/web/consumer/.next/standalone ./
COPY --from=build /app/apps/web/consumer/.next/static ./apps/web/consumer/.next/static


# USER nextjs

ARG PORT

ENV PORT=$PORT
ENV HOSTNAME="0.0.0.0"
EXPOSE $PORT

CMD ["sh", "-c", "infisical run --token $INFISICAL_TOKEN --projectId $INFISICAL_PROJECT_ID --env $INFISICAL_ENV --path $INFISICAL_PATH -- bun apps/web/consumer/server.js"]
# CMD ["infisical", "run", "--token", "$INFISICAL_TOKEN", "--projectId", "$INFISICAL_PROJECT_ID", "--env", "$INFISICAL_ENV", "--path", "$INFISICAL_PATH", "--command", "bun apps/web/consumer/server.js"]
