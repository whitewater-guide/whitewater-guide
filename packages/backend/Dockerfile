FROM node:14.16.0 AS builder

WORKDIR /opt/app

COPY packages/commons ./packages/commons
COPY packages/backend ./packages/backend
COPY patches ./patches
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --frozen-lockfile --non-interactive
RUN yarn workspace @whitewater-guide/commons build
RUN yarn workspace @whitewater-guide/backend build

# Skip development modules
FROM node:14.16.0 AS production

WORKDIR /opt/app

COPY --from=builder /opt/app/packages/commons/dist ./packages/commons/dist
COPY --from=builder /opt/app/packages/commons/package.json ./packages/commons/package.json

COPY --from=builder /opt/app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /opt/app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /opt/app/packages/backend/tsconfig.prod.json ./packages/backend/tsconfig.json

COPY patches ./patches
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --production --frozen-lockfile --non-interactive

# Final image
FROM gcr.io/distroless/nodejs:14

ENV NODE_ENV=production

COPY --from=production /opt/app /opt/app

WORKDIR /opt/app/packages/backend

CMD ["-r", "tsconfig-paths/register", "dist/index.js"]
