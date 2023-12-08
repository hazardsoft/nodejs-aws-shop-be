import { describe, expect, test, vi } from "vitest";
import { handler as importProductsHandler } from "../src/lambdas/importProducts";
import { HTTP_STATUS_CODES } from "../src/constants";
import {
  ImportApiFailedResponse,
  ImportMessages,
  ProductValidationErrors,
  ServerMessages,
} from "../src/types";

const mocks = vi.hoisted(() => {
  return {
    generateSignedUrl: vi.fn(),
  };
});

vi.mock("../src/bucket.js", () => {
  return {
    generateSignedUrl: mocks.generateSignedUrl,
  };
});

describe("Tests for import products lambda function", () => {
  const fileName = "products.csv";

  test("Get Signed Url (200)", async () => {
    const signedUrl = "generatedMockedUrl";
    mocks.generateSignedUrl.mockImplementationOnce(() => {
      return signedUrl;
    });

    const event = {
      queryStringParameters: {
        name: fileName,
      },
    };
    const response = await importProductsHandler(event);
    const url = response.body;

    expect(url).toBe(signedUrl);
    expect(response).toMatchObject({
      statusCode: HTTP_STATUS_CODES.ACCEPTED,
      body: signedUrl,
    });
  });

  test("Get Signed Url: empty file name (400)", async () => {
    const emptyFilename = "";

    const event = {
      queryStringParameters: {
        name: emptyFilename,
      },
    };
    const response = await importProductsHandler(event);
    const error = <ImportApiFailedResponse>JSON.parse(response.body);

    expect(error).toMatchObject(<ImportApiFailedResponse>{
      message: ImportMessages.FILENAME_EMPTY,
    });
    expect(response).toMatchObject({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });

  test("Get Signed Url: invalid file name (400)", async () => {
    const invalidFileName = "products";

    const event = {
      queryStringParameters: {
        name: invalidFileName,
      },
    };
    const response = await importProductsHandler(event);
    const error = <ImportApiFailedResponse>JSON.parse(response.body);

    expect(error).toMatchObject(<ImportApiFailedResponse>{
      message: ImportMessages.FILENAME_INVALID,
      reason: ProductValidationErrors.FILENAME_INVALID,
    });
    expect(response).toMatchObject({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(error),
    });
  });

  test("Get Signed Url (500)", async () => {
    const reason = "Mocked internal exception";
    mocks.generateSignedUrl.mockImplementationOnce(() => {
      throw new Error(reason);
    });

    const event = {
      queryStringParameters: {
        name: fileName,
      },
    };
    const response = await importProductsHandler(event);
    const error = <ImportApiFailedResponse>JSON.parse(response.body);

    expect(error).toMatchObject(<ImportApiFailedResponse>{
      message: ServerMessages.INTERNAL_SERVER_ERROR,
      reason,
    });
    expect(response).toMatchObject({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(error),
    });
  });
});
