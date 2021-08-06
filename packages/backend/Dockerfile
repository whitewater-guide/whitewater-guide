FROM node:14.17.4 AS builder

WORKDIR /opt/app

COPY packages/commons ./packages/commons
COPY packages/codegen-backend-tests ./packages/codegen-backend-tests
COPY packages/backend ./packages/backend
COPY packages/schema ./packages/schema
COPY packages/validation ./packages/validation
COPY patches ./patches
COPY scripts ./scripts
COPY package.json yarn.lock tsconfig.json codegen.yml lerna.json ./

# This runs prepare and postinstall scripts, which in turn run codegen and build libs
RUN yarn install --frozen-lockfile --non-interactive
# Now backend can be built
RUN yarn workspace @whitewater-guide/backend build

# Skip development modules
FROM node:14.17.4 AS production

WORKDIR /opt/app

COPY --from=builder /opt/app/packages/schema/dist ./packages/schema/dist
COPY --from=builder /opt/app/packages/schema/package.json ./packages/schema/package.json

COPY --from=builder /opt/app/packages/commons/dist ./packages/commons/dist
COPY --from=builder /opt/app/packages/commons/package.json ./packages/commons/package.json

COPY --from=builder /opt/app/packages/validation/dist ./packages/validation/dist
COPY --from=builder /opt/app/packages/validation/package.json ./packages/validation/package.json

COPY --from=builder /opt/app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /opt/app/packages/backend/package.json ./packages/backend/package.json

COPY patches ./patches
COPY scripts ./scripts
# tsconfig is needed for paths aliases (~)
COPY package.json yarn.lock tsconfig.json ./

# --ignore-scripts should ignore prepare and postinstall
RUN yarn install --production --frozen-lockfile --non-interactive --ignore-scripts
# because of --ignore-scripts we have to run patch-package manually. Ignore errors for frontend packages
RUN yarn patch-package || true

# Final image
FROM gcr.io/distroless/nodejs:14

ENV NODE_ENV=production

COPY --from=production /opt/app /opt/app

WORKDIR /opt/app/packages/backend

CMD ["-r", "tsconfig-paths/register", "dist/index.js"]
