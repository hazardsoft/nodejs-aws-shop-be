import { describe, expect, test, vi } from "vitest";
import { mockAvailableProduct } from "./setup.js";
import { handler as getAllProducts } from "../../src/lambdas/getProducts.js";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ServerMessages,
} from "../../src/types.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_STATUS_CODES } from "../../src/constants.js";

const mocks = vi.hoisted(() => {
  return {
    getAllProducts: vi.fn(),
  };
});

vi.mock("../../src/repository.js", () => {
  return {
    getAllProducts: mocks.getAllProducts,
  };
});

describe("Unit tests for get all products handler", () => {
  test("Get all products (200)", async () => {
    const allProducts: AvailableProduct[] = [mockAvailableProduct];
    mocks.getAllProducts.mockResolvedValueOnce(allProducts);

    const event = { path: "/products" } as APIGatewayProxyEvent;
    const productsResponse = await getAllProducts(event);
    const products = <AvailableProduct[]>JSON.parse(productsResponse.body);

    expect(products.length).toBe(allProducts.length);
    expect(products).toEqual(allProducts);
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(allProducts),
    });
  });

  test("Get all products (500)", async () => {
    const reason =
      "Mocked repository thown the error while getting all products";
    mocks.getAllProducts.mockImplementationOnce(() => {
      throw new Error(reason);
    });

    const event = <APIGatewayProxyEvent>{ path: "/products" };
    const productsResponse = await getAllProducts(event);

    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason,
      }),
    });
  });
});
