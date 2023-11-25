import { describe, expect, test, vi } from "vitest";
import { handler as getAllProductsFunction } from "../src/lambdas/getProducts.js";
import { handler as getOneProductFunction } from "../src/lambdas/getOneProduct.js";
import { handler as createOneProductFunction } from "../src/lambdas/createProduct.js";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductInput,
} from "../src/types.js";
import { HTTP_STATUS_CODES } from "../src/constants.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ProductNotFoundError } from "../src/errors.js";
import { randomUUID } from "node:crypto";

const mocks = vi.hoisted(() => {
  return {
    getAllProducts: vi.fn(),
    getOneProduct: vi.fn(),
    createOneProduct: vi.fn(),
  };
});

vi.mock("../src/repository.js", () => {
  return {
    getAllProducts: mocks.getAllProducts,
    getOneProduct: mocks.getOneProduct,
    createOneProduct: mocks.createOneProduct,
  };
});

describe("Unit tests for Lambdas", () => {
  const mockAvailableProduct: AvailableProduct = {
    id: randomUUID(),
    title: "mock title",
    description: "mock description",
    price: 100,
    count: 15,
  };

  test("Get all products", async () => {
    const allProducts: AvailableProduct[] = [mockAvailableProduct];
    mocks.getAllProducts.mockResolvedValueOnce(allProducts);

    const event = { path: "/products" } as APIGatewayProxyEvent;
    const productsResponse = await getAllProductsFunction(event);
    const products = JSON.parse(productsResponse.body) as AvailableProduct[];

    expect(products.length).toBe(allProducts.length);
    expect(products).toEqual(allProducts);
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(allProducts),
    });
  });

  test("Get one product (200)", async () => {
    mocks.getOneProduct.mockResolvedValueOnce(mockAvailableProduct);

    const productResponse = await getOneProductFunction({
      pathParameters: {
        id: mockAvailableProduct.id,
      },
    });
    const availableProduct = JSON.parse(
      productResponse.body,
    ) as AvailableProduct;

    expect(availableProduct).toEqual(mockAvailableProduct);
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(mockAvailableProduct),
    });
  });

  test("Get one product (400)", async () => {
    const invalidProductId = "";
    const productsResponse = await getOneProductFunction({
      pathParameters: {
        id: invalidProductId,
      },
    });

    const error = JSON.parse(productsResponse.body) as ProductApiFailedResponse;

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Product id is not defined",
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
    const invalidProductId = "incorrectProductId";
    const productsResponse = await getOneProductFunction({
      pathParameters: {
        id: invalidProductId,
      },
    });
    const error = JSON.parse(productsResponse.body) as ProductApiFailedResponse;

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      errorCode: HTTP_STATUS_CODES.NOT_FOUND,
      message: "Product Not Found",
    });
    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
      body: JSON.stringify(error),
    });
  });

  test("Create one product (204)", async () => {
    mocks.createOneProduct.mockResolvedValue(mockAvailableProduct);

    const productDao = <ProductInput>{
      title: mockAvailableProduct.title,
      description: mockAvailableProduct.description,
      price: mockAvailableProduct.price,
      count: mockAvailableProduct.count,
    };

    const event = { body: JSON.stringify(productDao) } as APIGatewayProxyEvent;
    const productResponse = await createOneProductFunction(event);

    const product = JSON.parse(productResponse.body) as AvailableProduct;

    expect(product).toEqual(mockAvailableProduct);
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(mockAvailableProduct),
    });
  });

  test("Create one product with invalid payload (400)", async () => {
    const invalidProductDao = <ProductInput>{
      ...mockAvailableProduct,
      title: "",
    };

    const event = {
      body: JSON.stringify(invalidProductDao),
    } as APIGatewayProxyEvent;
    const productResponse = await createOneProductFunction(event);

    const error = JSON.parse(productResponse.body) as AvailableProduct;

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Product payload is absent or incorrect",
    });
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });
  test("Create one product with empty payload (400)", async () => {
    const event = { body: null } as APIGatewayProxyEvent;
    const productResponse = await createOneProductFunction(event);

    const error = JSON.parse(productResponse.body) as AvailableProduct;

    expect(error).toMatchObject(<ProductApiFailedResponse>{
      errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Product payload is absent or incorrect",
    });
    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });
});
