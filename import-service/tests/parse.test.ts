import { describe, expect, test, vi } from "vitest";
import { handler as parseProductsHandler } from "../src/lambdas/parseProducts";
import { S3Event, S3EventRecord } from "aws-lambda";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import { config } from "../cdk/constants";
import { products } from "./data/products";
import * as productsParser from "../src/utils/parser";
import * as bucket from "../src/bucket";
import {
  BucketCopyObjectError,
  BucketDeleteObjectError,
  BucketGetObjectError,
} from "../src/errors";
import { HTTP_STATUS_CODES } from "../src/constants";

const mocks = vi.hoisted(() => {
  return {
    S3Client: {
      send: vi.fn(),
    },
    GetObjectCommand: vi.fn(),
    CopyObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
  };
});

vi.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: vi.fn().mockImplementationOnce(() => {
      return {
        send: mocks.S3Client.send,
      };
    }),
    GetObjectCommand: mocks.GetObjectCommand,
    CopyObjectCommand: mocks.CopyObjectCommand,
    DeleteObjectCommand: mocks.DeleteObjectCommand,
  };
});

describe("Tests for parse products lambda function", () => {
  const fileName = `${config.bucketUploadedPrefix}/products.csv`;
  const bucketName = "test-bucket";
  const invalidHttpStatusCode = 1000;
  const stream = createReadStream(resolve("./tests/data/products.csv"));

  const mockS3GetObjectSuccess = (body: Readable | null) => {
    mocks.S3Client.send.mockImplementationOnce(() => {
      return {
        Body: body,
      };
    });
  };
  const mockS3CopyObjectSuccess = (httpStatusCode: number) => {
    mocks.S3Client.send.mockImplementationOnce(() => {
      return {
        $metadata: { httpStatusCode },
      };
    });
  };
  const mockS3DeleteObjectSuccess = (httpStatusCode: number) => {
    mocks.S3Client.send.mockImplementationOnce(() => {
      return {
        $metadata: { httpStatusCode },
      };
    });
  };

  test("Parse products from CSV file", async () => {
    mockS3GetObjectSuccess(stream);
    mockS3CopyObjectSuccess(HTTP_STATUS_CODES.OK);
    mockS3DeleteObjectSuccess(HTTP_STATUS_CODES.NO_CONTENT);

    const parserSpy = vi.spyOn(productsParser, "readProducts");
    const getObjectSpy = vi.spyOn(bucket, "getObject");
    const copyObjectSpy = vi.spyOn(bucket, "copyObject");
    const deleteObjectSpy = vi.spyOn(bucket, "deleteObject");

    const event: S3Event = {
      Records: [
        <S3EventRecord>{
          s3: { bucket: { name: bucketName }, object: { key: fileName } },
        },
      ],
    };
    await parseProductsHandler(event);

    const source = { bucketName, key: fileName };
    expect(getObjectSpy).toHaveBeenCalledOnce();
    expect(getObjectSpy).toHaveBeenCalledWith(source);

    expect(copyObjectSpy).toHaveBeenCalledOnce();
    expect(copyObjectSpy).toHaveBeenCalledWith({
      from: source,
      to: {
        bucketName,
        key: `${fileName.replace(
          config.bucketUploadedPrefix,
          config.bucketParsedPrefix,
        )}`,
      },
    });

    expect(deleteObjectSpy).toHaveBeenCalledOnce();
    expect(deleteObjectSpy).toHaveBeenCalledWith(source);

    expect(parserSpy).toHaveBeenCalledOnce();
    expect(parserSpy).toHaveLastReturnedWith(products);
  });

  test("Get S3 object throws exception", async () => {
    mockS3GetObjectSuccess(null);

    const event: S3Event = {
      Records: [
        <S3EventRecord>{
          s3: { bucket: { name: bucketName }, object: { key: fileName } },
        },
      ],
    };

    await expect(parseProductsHandler(event)).rejects.toThrow(
      BucketGetObjectError,
    );
  });

  test("Copy S3 object throws exception", async () => {
    mockS3GetObjectSuccess(stream);
    mockS3CopyObjectSuccess(invalidHttpStatusCode);

    const event: S3Event = {
      Records: [
        <S3EventRecord>{
          s3: { bucket: { name: bucketName }, object: { key: fileName } },
        },
      ],
    };

    await expect(parseProductsHandler(event)).rejects.toThrow(
      BucketCopyObjectError,
    );
  });

  test("Delete S3 object throws exception", async () => {
    mockS3GetObjectSuccess(stream);
    mockS3CopyObjectSuccess(HTTP_STATUS_CODES.OK);
    mockS3DeleteObjectSuccess(invalidHttpStatusCode);

    const event: S3Event = {
      Records: [
        <S3EventRecord>{
          s3: { bucket: { name: bucketName }, object: { key: fileName } },
        },
      ],
    };

    await expect(parseProductsHandler(event)).rejects.toThrow(
      BucketDeleteObjectError,
    );
  });
});
