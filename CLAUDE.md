# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

whitewater.guide — a full-stack monorepo for a whitewater sports platform. Includes a Node.js GraphQL backend, React web admin app, React Native mobile app, and shared libraries.

## Common Commands

```bash
# Package manager: pnpm (hoisted node_modules via .npmrc)
# Node version: see .nvmrc

# Build all packages
pnpm build

# Typecheck all packages (continues on failure)
pnpm typecheck

# GraphQL codegen (types, resolvers, fragments, hooks)
pnpm codegen

```

### Validating changes

```bash
# Apps (any package in apps/): validate TypeScript inside the app directory
cd apps/<name> && pnpm tsc --noEmit

# Libraries (packages/): build the library, then typecheck from root
cd packages/<name> && pnpm build
pnpm typecheck   # run from workspace root — checks the library and its dependents
```

Do NOT run prettier or lint checks manually — they run automatically via git hooks on commit.

### Per-package commands

```bash
# Run a single test file (backend example — runs pretest DB setup then jest)
cd apps/backend && pnpm test -- --testPathPattern=path/to/test

# Run a single test file (other packages)
cd packages/<name> && pnpm test -- --testPathPattern=path/to/test

# Web uses react-scripts (CRA)
cd apps/web && pnpm test
```

### Docker dev environment

```bash
pnpm dev:env        # Spin up local dev services (postgres, minio, gorge, etc.)
pnpm dev:cleanup    # Delete all dev docker images/volumes/containers
```

## Architecture

### Monorepo layout (pnpm workspaces)

#### Apps (`apps/`)

| App       | Description                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `backend` | Apollo GraphQL server on Koa. PostgreSQL via Knex. Auth via Passport (JWT, Facebook, Apple, Google). Runs in Docker. |
| `web`     | React admin/editor app (CRA, Material-UI 4, Apollo Client 3, React Router 5)                                         |
| `mobile`  | **Deprecated.** Legacy React Native app (RN 0.72). Do not fix build/tool failures here.                              |
| `mobile2` | Modernized React Native app — rebuilt from scratch to replace `mobile`. Currently under construction.                |

#### Packages (`packages/`)

| Package                 | Description                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `clients`               | Shared client code (Apollo cache policies, hooks, routing helpers, charting)                         |
| `commons`               | Shared utilities for both backend and frontend (dual ESM/CJS build)                                  |
| `schema`                | GraphQL schema (`.graphql` files), generated TypeScript types, shared fragments (dual ESM/CJS build) |
| `validation`            | Yup validation schemas (dual ESM/CJS build)                                                          |
| `eslint-config`         | Shared ESLint configuration                                                                          |
| `codegen-typedefs`      | Custom GraphQL codegen plugin for typedefs                                                           |
| `codegen-backend-tests` | Custom codegen for strongly-typed backend test helpers                                               |

### GraphQL code generation

`codegen.yml` at root drives `@graphql-codegen/cli`:

- Schema source: `packages/schema/schema/*.graphql`
- Shared fragments: `packages/schema/fragments/*.gql`
- Generated types go to `packages/schema/src/__generated__/`
- Backend resolvers generated to `apps/backend/src/apollo/resolvers.generated.ts`
- Frontend queries/mutations use `near-operation-file` preset (`.generated.ts` siblings next to `.gql` files)
- Mobile has an additional local schema (`apps/mobile/schema/mobile-local-schema.graphql`)
- Custom scalars mapped via global types in `codegen-scalars.ts` files (Date, DateTime, JSON, Cursor, Coordinates differ between backend and frontend)

### Backend specifics

- Koa + Apollo Server + PostgreSQL (PostGIS + TimescaleDB) + Knex
- Database models/types in `apps/backend/src/db/` with `Sql.*` namespace
- Backend tests require Docker services running (`pnpm dev:env`) — the test script runs pretest DB setup automatically
- Jest config uses `ts-jest`, node environment, dotenv-flow for env vars

### Testing

- Jest everywhere (ts-jest preset), except web (react-scripts test)
- Mobile uses `react-native` jest preset with custom setup for mapbox and gesture handler
- Backend tests need running Docker services (postgres, minio)

## Conventions

- **Commits**: Conventional commits enforced via commitlint (`@commitlint/config-conventional`)
- **Pre-commit hooks**: Husky runs prettier + eslint via lint-staged on staged files
- React packages (web, mobile, mobile2, clients): [React Conventions](.claude/react-conventions.md)
