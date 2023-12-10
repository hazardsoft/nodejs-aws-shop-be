import { describe, expect, test, vi } from "vitest";
import { APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { mockAvailableProduct } from "./setup.js";
import { handler as getOneProduct } from "../../src/lambdas/getOneProduct.js";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductMessages,
  ServerMessages,
} from "../../src/types.js";

import { HTTP_STATUS_CODES } from "../../src/constants.js";
import { ProductNotFoundError } from "../../src/errors.js";

const mocks = vi.hoisted(() => {
  return {
    getOneProduct: vi.fn(),
  };
});

vi.mock("../../src/repository.js", () => {
  return {
    getOneProduct: mocks.getOneProduct,
  };
});

describe("Unit tests for get one product handler", () => {
  test("Get one product (200)", async () => {
    mocks.getOneProduct.mockResolvedValueOnce(mockAvailableProduct);

    const productResponse = await getOneProduct({
      pathParameters: {
        id: mockAvailableProduct.id,
      },
    });
    const availableProduct = <AvailableProduct>JSON.parse(productResponse.body);

    expect(availableProduct).toEqual(mockAvailableProduct);
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(mockAvailableProduct),
    });
  });

  test("Get one product (400, empty product id)", async () => {
    const emptyProductId = "";
    const productsResponse = await getOneProduct({
      pathParameters: {
        id: emptyProductId,
      },
    });

    const error = <ProductApiFailedResponse>JSON.parse(productsResponse.body);

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      message: ProductMessages.PRODUCT_EMPTY_ID,
    });
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });

  test("Get one product (400, invalid UUID)", async () => {
    const invalidUUID = uuidv4().substring(1);
    const productsResponse = await getOneProduct({
      pathParameters: {
        id: invalidUUID,
      },
    });

    const error = <ProductApiFailedResponse>JSON.parse(productsResponse.body);

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      message: ProductMessages.PRODUCT_INVALID_UUID,
    });
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });

  test("Get one product (404)", async () => {
    mocks.getOneProduct.mockImplementationOnce(() => {
      throw new ProductNotFoundError();
    });
    const nonExistingId = uuidv4();
    const productsResponse = await getOneProduct({
      pathParameters: {
        id: nonExistingId,
      },
    });
    const error = <ProductApiFailedResponse>JSON.parse(productsResponse.body);

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      message: ProductMessages.PRODUCT_NOT_FOUND,
    });
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
      body: JSON.stringify(error),
    });
  });

  test("Get one product (500)", async () => {
    const reason = "Mocked repository thown the error while getting a product";
    mocks.getOneProduct.mockImplementationOnce(() => {
      throw new Error(reason);
    });
    const event = { pathParameters: { id: mockAvailableProduct.id } };
    const productsResponse = await getOneProduct(event);

    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason,
      }),
    });
  });
});
