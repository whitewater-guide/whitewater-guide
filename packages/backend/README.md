# Env variables

## Container-specific

| Variable name               | Value examples (defaults)               | Description                        |
|-----------------------------|-----------------------------------------|------------------------------------|
| CORS_WHITELIST              | localhost,applications,whitewater.guide | Cors whitelist for express |
| LOG_LEVEL                   | debug                                   | log level for pino logger |
| SESSION_SECRET              | <random_secret>                         | Secret for passport.js sessions |
| FB_APP_ID                   | <some_numbers>                          | Facebook app id |
| FB_SECRET                   | <random_secret>                         | Secret for facebook auth |
| APOLLO_EXPOSE_SCHEMA        | true                                    | Should Apollo router expose 'schema.json' and 'typedefs.txt'? Mostly used by devtools and tests (mock data generator) |
| APOLLO_EXPOSE_GRAPHIQL      | true                                    | Should Apollo router expose GRAPHIQL UI
