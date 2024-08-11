# BFF Service

Service proxies requests to Product and Cart services.
Product/Cart endpoints URLs should be defined in `.env` file created out of [.env.example](.env.example) file.

## Usage

1. `{bff_api}/product` - proxies requests to Product service;
2. `{bff_api}/cart` - proxies requests to Cart service (`Authorization` token with Basic auth must be present in original request for authentication);

## Environment

1. `cart` - path to Cart Service endpoint;
2. `product` - path to Product Service endpoint;
3. `CACHE_TTL` - time in seconds for cache freshness;
4. `PORT` - port to listen to (the same env var is used by Elastic Beanstalk to map ports from nginx to container)

## NPM Scripts

1. `build` - compiles BFF service into `dist` folder;
2. `start` - runs BFF service application;
5. `eb:init` - initializes Elastic Beanstalk application (pass profile/region upon calling this script, e.g. `npm run eb:init -- --profile {profile} --region {region}`);
6. `eb:create` - creates environment `hazardsoft/aws-bff-service-develop` in Elastic Beanstalk application;
7. `eb:deploy` - deployed version of Elastic Beanstalk application to `hazardsoft/aws-bff-service-develop` environment;
8. `eb:destroy` - destroys `hazardsoft/aws-bff-service-develop` environment of Elastic Beanstalk application.

## Caching

All products fetched by `product` endpoint are stored in in-memory cache (cache expiration is set with `CACHE_TTL` var (in seconds) in `.env` file, defaults to `0` if not defined).

## API Testing

[Postman collection](./postman/bff.postman_collection.json) can be used to test BFF service from local machine.
The folllowing cases are covered:
1. `GET` all products;
2. `GET` one product;
3. `POST` one product;
4. `GET` cart of an user (includes `Authorization` token);
5. `PUT` cart with a product (includes `Authorization` token);
6. `POST` cart with an order (includes `Authorization` token);