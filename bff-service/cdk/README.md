# Overview

Contains AWS CDK infrastructure as code for BFF Service.
Describes the following resources:

1. HTTP API to proxy requests to cart/product services.

## Environment

### HTTP API

Elastic Beanstalk deploy provides HTTP endpoint, but to integrate it with FE it is necessary to have HTTPS endpoint.
In order to provide HTTPS endpoint additional HTTP API is created to proxy requests to EC2 instance of EB application.
The following env var is used to define EB endpoint:

- `BFF_SERVICE_URL`

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
