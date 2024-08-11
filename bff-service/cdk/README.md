# Overview

Contains AWS CDK infrastructure as code for Cart Service.
Describes the following resources:

1. Lambda cart handler (uses basic auth token encoded in Base64 provided in `Authorization` request header to authenticate an user);
2. RDS DB instance (Postgres) to store users, cart items, carts, orders;
3. Network resources (e.g. VPC and security groups) to provide means of communication between Lambda and RDS DB instance, RDS DB instance and Internet

## Environment

### RDS DB Instance

The following env vars are used by AWS CDK stack during RDS DB instance creation (copy/paste [.env.example](./.env.example), rename it to `.env` and fill with the relevant values):

- `DATABASE_USERNAME`;
- `DATABASE_PASSWORD`.

### Lambda - Cart Handler

The following env var is passed into cart handler in order to provide access to previously created RDS DB instance:

- `DATABASE_URL` - generated dynamically based on db instance endpoint host/port values + username/password passed via `.env` file.

### HTTP API

Elastic Beanstalk deploy provides HTTP endpoint, but to integrate it with FE it is necessary to have HTTPS endpoint.
In order to provide HTTPS endpoint additional HTTP API is created to proxy requests to EC2 instance of EB application.
The following env var is used to define EB endpoint:

- `CART_SERVICE_URL`

## NPM scripts

- `lint` - runs ESLint with fix option

- `format` - runs Prettier with fix option

- `build` - builds Lambdas and AWS CDK application

- `test` - runs unit tests for AWS CDK application
- `cdk` - builds/runs AWS CDK project (no need to call manually, it's used in `cdk.json` config file);

- `cdk:diff` - runs AWS CDK diff command to illustrate how local template is different to a deployed one (in order to use a user's profile the script needs to be run as `npm run cdk:diff -- --profile={profile_name}`)

- `cdk:deploy` - runs AWS CDK deploy command to deploy stack (in order to use a user's profile the script needs to be run as `npm run cdk:deploy -- --profile={profile_name}`)

- `cdk:destroy` - runs AWS CDK destroy command to destroy previously deployed stack (in order to use a user's profile the script needs to be run as `npm run cdk:destroy -- --profile={profile_name}`)

## Deployment

In order to deploy application stack with AWS CDK one needs to run the following command:
`npm run cdk:deploy` (in order to use a user's profile the script needs to be run as `npm run cdk:deploy -- --profile={profile_name}`)
