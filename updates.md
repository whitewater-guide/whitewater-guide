Big upgrades required:

- apollo-client
  - useFragment drops its experimental label
  - client query/directive?
  - Calling fetchMore for queries using the cache-and-network or network-only fetch policies will no longer trigger additional network requests when cache results are complete. Instead, those complete cache results will be delivered as if using the cache-first fetch policy.
- material-ui
- notistack
- downshift
- history
- react-router

Updates to avoid really old deps:

- google-play-billing-validator -> "@googleapis/androidpublisher" acknowledgement
