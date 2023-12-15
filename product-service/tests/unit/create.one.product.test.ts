import { describe, expect, test, vi } from "vitest";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { mockAvailableProduct, productDao } from "./setup.js";
import { handler as createOneProduct } from "../../src/lambdas/createProduct.js";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductMessages,
  ServerMessages,
} from "../../src/types.js";
import { HTTP_STATUS_CODES } from "../../src/constants.js";
import { invalidProductsTestInput } from "./data/input.js";

const mocks = vi.hoisted(() => {
  return {
    createOneProduct: vi.fn(),
  };
});

vi.mock("../../src/repository.js", () => {
  return {
    createOneProduct: mocks.createOneProduct,
  };
});

describe("Unit tests for get one product handler", () => {
  test("Create one product (204)", async () => {
    mocks.createOneProduct.mockResolvedValueOnce(mockAvailableProduct);

    const event = <APIGatewayProxyEvent>{ body: JSON.stringify(productDao) };
    const productResponse = await createOneProduct(event);

    const product = <AvailableProduct>JSON.parse(productResponse.body);

    expect(product).toEqual(mockAvailableProduct);
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(mockAvailableProduct),
    });
  });

  test.each(invalidProductsTestInput)(
    "Create one product with invalid payload (400) %#",
    async (testInput) => {
      const event = <APIGatewayProxyEvent>{
        body: JSON.stringify(testInput.product),
      };
      const productResponse = await createOneProduct(event);

      const error = <ProductApiFailedResponse>JSON.parse(productResponse.body);

      expect(error).toMatchObject(<ProductApiFailedResponse>{
        message: ProductMessages.PRODUCT_INVALID_PAYLOAD,
        reason: testInput.reason,
      });
      expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify(error),
      });
    },
  );

  test("Create one product with empty payload (400)", async () => {
    const event = <APIGatewayProxyEvent>{ body: null };
    const productResponse = await createOneProduct(event);

    const error = <ProductApiFailedResponse>JSON.parse(productResponse.body);

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      message: ProductMessages.PRODUCT_EMPTY_PAYLOAD,
    });
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });

  test("Create one product (500)", async () => {
    const reason = "Mocked repository thown the error while creating a product";
    mocks.createOneProduct.mockImplementationOnce(() => {
      throw new Error(reason);
    });
    const event = <APIGatewayProxyEvent>{ body: JSON.stringify(productDao) };
    const productResponse = await createOneProduct(event);

    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason,
      }),
    });
  });
});
