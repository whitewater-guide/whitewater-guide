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
| RUNTIME_FACEBOOK_APP_ID   | Runtime facebook app id                                         |
| REACT_APP_GOOGLE_API_KEY  | google api key                                                  |
| REACT_APP_FACEBOOK_APP_ID | Build-time facebook app id                                      |
| REACT_APP_RAVEN           | sentry endpoint for error tracking                              |
| REACT_APP_API             | Build-time backend API url, e.g. `https://api.whitewater.guide` |
