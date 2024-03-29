# BFF Service

Service proxies requests to Product and Cart services.
Product/Cart endpoints URLs should be defined in `.env` file created out of [.env.example](.env.example) file.

## Usage

1. `{bff_api}/product` - proxies requests to Product service;
2. `{bff_api}/cart` - proxies requests to Cart service (`Authorization` token with Basic auth must be present in original request for authentication);

## API Testing

[Postman collection](./postman/RS%20AWS%20-%20Task%2010.postman_collection.json) can be used to test BFF service from local machine.
The folllowing cases are covered:
1. `GET` all products;
2. `GET` one product;
3. `GET` cart of an user (includes `Authorization` token);
4. `PUT` cart with a product (includes `Authorization` token);
5. `POST` cart with an order (includes `Authorization` token);
6. `GET` non-existing endpoint (neither product nor cart).

## NPM Scripts

1. `build` - compiles BFF service into `dist` folder;
2. `start` - runs BFF service application;
3. `docker:build` - builds docker image `hazardsoft/aws-bff-service` with BFF service;
4. `docker:publish` - publishes docker image to public Docker Hub;
5. `eb:init` - initializes Elastic Beanstalk application (pass profile/region upon calling this script, e.g. `npm run eb:init -- --profile {profile} --region {region}`);
6. `eb:create` - creates environment `hazardsoft/aws-bff-service-develop` in Elastic Beanstalk application;
7. `eb:deploy` - deployed version of Elastic Beanstalk application to `hazardsoft/aws-bff-service-develop` environment;
8. `eb:destroy` - destroys `hazardsoft/aws-bff-service-develop` environment of Elastic Beanstalk application.

## Caching

All products fetched by `product` endpoint are stored in in-memory cache (cache expiration is set with `PRODUCTS_CACHE_EXPIRATION` var (in seconds) in `.env` file, defaults to `0` if not defined).