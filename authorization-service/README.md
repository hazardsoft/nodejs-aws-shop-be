# Overview

Auhorization Service is responsible for providing Lambda authorizer to be used with Api Gateway methods (t to authorize an user in this specific case).
This service has the following folders structure (different if compared to other services in this monorepo):

1. `authorization-service/cdk` (refer to [README.md](./cdk/README.md) for more details) contains AWS CDK project + unit tests;
2. `authorization-service` contains Lambda handler code + unit tests.

The idea was to clearly decouple these 2 so respective `package.json` files contain relevant dependencies only.
Separating Lambda code and its infrastructure code makes it possible to maintain them separately and publish as individual npm packages.

## NPM scripts

- `lint` - runs ESLint with fix option

- `format` - runs Prettier with fix option

- `build` - builds Lambdas

- `test` - runs unit tests