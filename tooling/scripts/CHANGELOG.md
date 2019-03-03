## [0.0.32](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.31...@whitewater-guide/scripts@0.0.32) (2019-03-03)

### Features

- caddy cache and cache headers for images ([4069439](https://github.com/doomsower/whitewater/commit/4069439))

## [0.0.31](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.30...@whitewater-guide/scripts@0.0.31) (2019-03-02)

### Bug Fixes

- **scripts:** fix prerelease guardian ([0e1105c](https://github.com/doomsower/whitewater/commit/0e1105c))

## [0.0.30](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.29...@whitewater-guide/scripts@0.0.30) (2019-03-02)

### Features

- use subdomains for api, minio, adminer, admin ([e1d1f0d](https://github.com/doomsower/whitewater/commit/e1d1f0d))

## [0.0.30-subdomains.0](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.29...@whitewater-guide/scripts@0.0.30-subdomains.0) (2019-02-28)

### Features

- **scrips:** images can now be published from any branch ([0d69adb](https://github.com/doomsower/whitewater/commit/0d69adb))

## [0.0.29](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.28...@whitewater-guide/scripts@0.0.29) (2019-02-25)

### Features

- **scripts:** allow \* to publish all ([ecff708](https://github.com/doomsower/whitewater/commit/ecff708))

## [0.0.28](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.27...@whitewater-guide/scripts@0.0.28) (2019-02-19)

## [0.0.27](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.26...@whitewater-guide/scripts@0.0.27) (2019-02-19)

### Features

- **scripts:** make pre-commit hook fail on linters ([294b111](https://github.com/doomsower/whitewater/commit/294b111))

## [0.0.26](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.25...@whitewater-guide/scripts@0.0.26) (2019-02-19)

### Features

- **scripts:** publish can now accept list of services ([459c85a](https://github.com/doomsower/whitewater/commit/459c85a))

## [0.0.25](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.24...@whitewater-guide/scripts@0.0.25) (2019-02-19)

### Bug Fixes

- **scripts:** do not ensure `dev-mount/db` dir ([f49b70e](https://github.com/doomsower/whitewater/commit/f49b70e))
- **scripts:** push only changed images ([6ffe870](https://github.com/doomsower/whitewater/commit/6ffe870))

## [0.0.24](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.23...@whitewater-guide/scripts@0.0.24) (2019-02-17)

### Bug Fixes

- **db:** use named mount for pgdata to avoid permission errors ([4073459](https://github.com/doomsower/whitewater/commit/4073459)), closes [#343](https://github.com/doomsower/whitewater/issues/343)

## [0.0.23](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.22...@whitewater-guide/scripts@0.0.23) (2019-02-15)

## [0.0.22](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.21...@whitewater-guide/scripts@0.0.22) (2019-02-14)

## [0.0.21](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.20...@whitewater-guide/scripts@0.0.21) (2019-02-10)

### Features

- **scripts:** safeguard for `git secret hide` in pre-commit ([bf97477](https://github.com/doomsower/whitewater/commit/bf97477))

## [0.0.20](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.19...@whitewater-guide/scripts@0.0.20) (2019-02-10)

### Bug Fixes

- **scripts:** fix staging:sync ([4e32e4d](https://github.com/doomsower/whitewater/commit/4e32e4d))

## [0.0.19](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.18...@whitewater-guide/scripts@0.0.19) (2019-02-09)

## [0.0.18](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.17...@whitewater-guide/scripts@0.0.18) (2019-02-07)

### Features

- sections edit log ([ec01155](https://github.com/doomsower/whitewater/commit/ec01155)), closes [#323](https://github.com/doomsower/whitewater/issues/323)

## [0.0.17](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.16...@whitewater-guide/scripts@0.0.17) (2019-02-03)

## [0.0.16](https://github.com/doomsower/whitewater/compare/@whitewater-guide/scripts@0.0.16...@whitewater-guide/scripts@0.0.16) (2019-02-03)

### Bug Fixes

- **scripts:** changelog ([886496d](https://github.com/doomsower/whitewater/commit/886496d))
- **scripts:** fix imageExistsInECR ([40a43f9](https://github.com/doomsower/whitewater/commit/40a43f9))
- **scripts:** now correctly checks with AWS ECR to prevent republishing ([52e66ef](https://github.com/doomsower/whitewater/commit/52e66ef))

### Features

- **workers:** added tirol worker and internal changes: ([cc6150e](https://github.com/doomsower/whitewater/commit/cc6150e)), closes [#327](https://github.com/doomsower/whitewater/issues/327)
