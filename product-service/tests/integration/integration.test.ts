import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, test } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { handler as getAllProductsFunction } from "../../src/lambdas/getProducts.js";
import { handler as getOneProductFunction } from "../../src/lambdas/getOneProduct.js";
import { handler as createOneProductFunction } from "../../src/lambdas/createProduct.js";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductInput,
  ProductMessages,
} from "../../src/types.js";
import { HTTP_STATUS_CODES } from "../../src/constants.js";

describe("Integration tests with local DynamoDB", () => {
  test("Get all products (200)", async () => {
    const event = { path: "/products" } as APIGatewayProxyEvent;
    const productsResponse = await getAllProductsFunction(event);
    const products = <AvailableProduct[]>JSON.parse(productsResponse.body);

    expect(products.length).toBeGreaterThan(0);
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(products),
    });
  });

  test("Get one product (200)", async () => {
    const event = { path: "/products" } as APIGatewayProxyEvent;
    const productsResponse = await getAllProductsFunction(event);
    const products = <AvailableProduct[]>JSON.parse(productsResponse.body);

    const requestedProduct = products[0];

    const productResponse = await getOneProductFunction({
      pathParameters: {
        id: requestedProduct.id,
      },
    });
    const product = <AvailableProduct>JSON.parse(productResponse.body);

    expect(product).toEqual(requestedProduct);
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(requestedProduct),
    });
  });

  test("Get one product (404)", async () => {
    const nonExistingId = uuidv4();
    const event = { pathParameters: { id: nonExistingId } };
    const productsResponse = await getOneProductFunction(event);
    const error = <ProductApiFailedResponse>JSON.parse(productsResponse.body);

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      message: ProductMessages.PRODUCT_NOT_FOUND,
    });
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
      body: JSON.stringify(error),
    });
  });

  test("Create one product (204)", async () => {
    const productDao = <ProductInput>{
      title: "Title",
      description: "Description",
      price: 99,
      count: 1,
    };
    const event = <APIGatewayProxyEvent>{ body: JSON.stringify(productDao) };
    const productResponse = await createOneProductFunction(event);
    const createdProduct = <AvailableProduct>JSON.parse(productResponse.body);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...productNoId } = createdProduct;
    expect(productNoId).toEqual(productDao);
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(createdProduct),
    });
  });
});
