import { describe, expect, test, vi } from "vitest";
import { handler as getAllProductsFunction } from "../src/lambdas/getProducts.js";
import { handler as getOneProductFunction } from "../src/lambdas/getOneProduct.js";
import { handler as createOneProductFunction } from "../src/lambdas/createProduct.js";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductInput,
  ProductMessages,
  ServerMessages,
} from "../src/types.js";
import { HTTP_STATUS_CODES } from "../src/constants.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ProductNotFoundError } from "../src/errors.js";
import { v4 as uuidv4 } from "uuid";

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
    id: uuidv4(),
    title: "mock title",
    description: "mock description",
    price: 100,
    count: 15,
  };

  const productDao = <ProductInput>{
    title: mockAvailableProduct.title,
    description: mockAvailableProduct.description,
    price: mockAvailableProduct.price,
    count: mockAvailableProduct.count,
  };

  test("Get all products (200)", async () => {
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

  test("Get all products (500)", async () => {
    const reason =
      "Mocked repository thown the error while getting all products";
    mocks.getAllProducts.mockImplementationOnce(() => {
      throw new Error(reason);
    });

    const event = { path: "/products" } as APIGatewayProxyEvent;
    const productsResponse = await getAllProductsFunction(event);

    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason,
      }),
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

  test("Get one product (400, empty product id)", async () => {
    const emptyProductId = "";
    const productsResponse = await getOneProductFunction({
      pathParameters: {
        id: emptyProductId,
      },
    });

    const error = JSON.parse(productsResponse.body) as ProductApiFailedResponse;

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
    const productsResponse = await getOneProductFunction({
      pathParameters: {
        id: invalidUUID,
      },
    });

    const error = JSON.parse(productsResponse.body) as ProductApiFailedResponse;

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
    const productsResponse = await getOneProductFunction({
      pathParameters: {
        id: nonExistingId,
      },
    });
    const error = JSON.parse(productsResponse.body) as ProductApiFailedResponse;

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
    const productsResponse = await getOneProductFunction(event);

    expect(productsResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason,
      }),
    });
  });

  test("Create one product (204)", async () => {
    mocks.createOneProduct.mockResolvedValueOnce(mockAvailableProduct);

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
      message: ProductMessages.PRODUCT_INVALID_PAYLOAD,
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
      message: ProductMessages.PRODUCT_INVALID_PAYLOAD,
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
    const event = { body: JSON.stringify(productDao) } as APIGatewayProxyEvent;
    const productResponse = await createOneProductFunction(event);

    expect(productResponse).toMatchObject(<APIGatewayProxyResult>{
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason,
      }),
    });
  });
});
