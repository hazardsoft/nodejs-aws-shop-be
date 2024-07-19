# Overview

Contains AWS CDK infrastructure as code for Authorization Service.
Describes authorizer lambda (uses basic auth token encoded in Base64 provided in `Authorization` request header to authenticate an user) and exports its ARN to be used on another stack.

## Environment

### Authorization

The following env vars are used in AWS CDK stack to configure user name and password to be verified against in Lambda handler:

1. `USER_NAME` (GitHub username);
2. `USER_PASSWORD` (`TEST_PASSWORD` by default).

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
