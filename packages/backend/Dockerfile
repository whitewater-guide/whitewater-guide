FROM node:18.17.1 AS pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update \
    && apt-get install --yes rsync

FROM pnpm AS builder

WORKDIR /opt/app

COPY packages/commons ./packages/commons
COPY packages/codegen-backend-tests ./packages/codegen-backend-tests
COPY packages/codegen-typedefs ./packages/codegen-typedefs
COPY packages/backend ./packages/backend
COPY packages/schema ./packages/schema
COPY packages/validation ./packages/validation
COPY patches ./patches
COPY scripts ./scripts
COPY package.json tsconfig.json codegen.yml .npmrc pnpm-lock.yaml pnpm-workspace.yaml ./

# This runs prepare and postinstall scripts, which in turn run codegen and build libs
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
# Now backend can be built. Note '...' for transitive dependencies
RUN pnpm --filter "@whitewater-guide/backend"... run build

# Skip development modules
FROM pnpm AS production

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
COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml ./

# setting NODE_ENV=production will skip certain parts of 'prepare' and 'postinstall' scripts
# that were ran in 'builder' before
#
# Note --fix-lockfile instead of --frozen-lockfile
# This is a workaround: pnpm overrides has some frontend-only overrides and will break when installing with frozen-lockfile
ENV NODE_ENV=production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --fix-lockfile

# Final image
FROM gcr.io/distroless/nodejs:18

ENV NODE_ENV=production

COPY --from=production /opt/app /opt/app

WORKDIR /opt/app/packages/backend

CMD ["dist/index.js"]
