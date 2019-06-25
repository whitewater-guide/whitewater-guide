# CRA changes

[CRACO](https://github.com/sharegate/craco) is used to disable eslint, because since CRA 3.0 it's especially annoying.
Probably should later switch to eslint-typescript from tslint globally, but for now just use global tslint and disable CRA's eslint;

# Environment

## Build-time and runtime variables

This is CRA2 static web app. CRA only uses build-time env variables, prefixed with `REACT_APP_`
However, this app needs to know URL of API backend. This URL is different for production, staging, local environments.
But from CRA point of view, these environments are the same production build. To make them different, we use runtime environment, prefixed with `RUNTIME_`
These variables are injected into `index.html` using dockerize.

Build-time variables have precedence over runtime variables (see `environment.ts`)

## Variables in env files

| Variable name             | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| PORT                      | port to server static app during development                    |
| RUNTIME_API               | Runtime backend API url, e.g. `https://api.whitewater.guide`    |
| RUNTIME_S3                | Runtime minio/s3 url, e.g. `https://s3.whitewater.guide`        |
| RUNTIME_FACEBOOK_APP_ID   | Runtime facebook app id                                         |
| REACT_APP_GOOGLE_API_KEY  | google api key                                                  |
| REACT_APP_FACEBOOK_APP_ID | Build-time facebook app id                                      |
| REACT_APP_API             | Build-time backend API url, e.g. `https://api.whitewater.guide` |
| REACT_APP_S3              | Build-time minio/s3 url, e.g. `https://s3.whitewater.guide`     |
| REACT_APP_SENTRY_DSN      | sentry endpoint for error tracking                              |
| SENTRY_URL                | URL of our own hosted sentry                                    |
| SENTRY_AUTH_TOKEN         | token to upload sourcemap to sentry                             |
| SENTRY_ORG                | org name to upload sourcemap to sentry                          |
| SENTRY_PROJECT            | project name to upload sourcemap to sentry                      |
