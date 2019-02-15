# Env variables

## Container-specific

| Variable name                | Value examples (defaults)                                  | Description                                                                                                           |
| ---------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| APP_DOMAIN                   | whitewater.guide (prod),<br/> localhost:6001 (dev)         | Application domain. Used in backend to substitute minio internal urls with external urls                              |
| PROTOCOL                     | https                                                      | Used in backend together with APP_DOMAIN to generate external image urls                                              |
| CORS_WHITELIST               | localhost,applications,whitewater.guide                    | Cors whitelist for express                                                                                            |
| LOG_LEVEL                    | debug                                                      | log level for pino logger                                                                                             |
| SESSION_SECRET               | <random_secret>                                            | Secret for passport.js sessions                                                                                       |
| FB_APP_ID                    | <some_numbers>                                             | Facebook app id                                                                                                       |
| FB_SECRET                    | <random_secret>                                            | Secret for facebook auth                                                                                              |
| APOLLO_EXPOSE_SCHEMA         | true                                                       | Should Apollo router expose 'schema.json' and 'typedefs.txt'? Mostly used by devtools and tests (mock data generator) |
| APOLLO_EXPOSE_GRAPHIQL       | true                                                       | Should Apollo router expose GRAPHIQL UI                                                                               |
| ENGINE_API_KEY               | service:<name>:<key>                                       | API key for Apollo Engine                                                                                             |
| MINIO_HOST                   | minio                                                      | Minio host name in docker internal network                                                                            |
| MINIO_PORT                   | 9000 (9001 for test because 9000 is used by ios simulator) | Minio host name in docker internal network                                                                            |
| AUTO_SEED                    | true                                                       | Set to true to automatically seed database on startup                                                                 |
| GOOGLE_IAB_PUBLICKEY_SANDBOX | <pubkey>                                                   | See https://github.com/voltrue2/in-app-purchase                                                                       |
| GOOGLE_IAB_PUBLICKEY_LIVE    | <pubkey>                                                   | See https://github.com/voltrue2/in-app-purchase                                                                       |
| IAP_DEBUG                    | false                                                      | Controls `verbose` and `test` config options for https://github.com/voltrue2/in-app-purchase                          |
| MAILCHIMP_API_KEY            | <random_secret>                                            | Mailchimp API key                                                                                                     |
| MAILCHIMP_LIST_ID            | <random_id>                                                | Mailchimp list id for site subscriptions                                                                              |

# Module aliases

To use module alias like `@features/regions` it should be added to 4 places:

- `paths` in `tsconfig.json`
- `no-implicit-dependencies` rule of `tslint.json`
- `moduleNameMapper` in `jest.config.json`
- `_moduleAliases` in `package.json` (so that compiled js can use aliases)
