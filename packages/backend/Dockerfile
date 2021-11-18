FROM node:14.17.6 AS builder

WORKDIR /opt/app

COPY packages/commons ./packages/commons
COPY packages/codegen-backend-tests ./packages/codegen-backend-tests
COPY packages/codegen-typedefs ./packages/codegen-typedefs
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
FROM node:14.17.6 AS production

WORKDIR /opt/app

COPY --from=builder /opt/app/packages/schema/dist ./packages/schema/dist
COPY --from=builder /opt/app/packages/schema/package.json ./packages/schema/package.json

COPY --from=builder /opt/app/packages/commons/dist ./packages/commons/dist
COPY --from=builder /opt/app/packages/commons/package.json ./packages/commons/package.json

COPY --from=builder /opt/app/packages/validation/dist ./packages/validation/dist
COPY --from=builder /opt/app/packages/validation/package.json ./packages/validation/package.json

COPY --from=builder /opt/app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /opt/app/packages/backend/scripts ./packages/backend/scripts
COPY --from=builder /opt/app/packages/backend/package.json ./packages/backend/package.json

COPY patches ./patches
COPY scripts ./scripts
COPY package.json yarn.lock ./
# tsconfig is needed for paths aliases (~)
COPY packages/backend/tsconfig.prod.json packages/backend/tsconfig.json

# setting NODE_ENV=production will skip certain parts of 'prepare' and 'postinstall' scripts
# that were run in 'builder' before
ENV NODE_ENV=production
RUN yarn install --production --frozen-lockfile --non-interactive

# Final image
FROM gcr.io/distroless/nodejs:14

ENV NODE_ENV=production

COPY --from=production /opt/app /opt/app

WORKDIR /opt/app/packages/backend

CMD ["-r", "tsconfig-paths/register", "dist/index.js"]
