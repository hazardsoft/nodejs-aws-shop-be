import { describe, expect, test, vi } from "vitest";
import { handler as createManyProducts } from "../../src/lambdas/createManyProducts.js";
import { HTTP_STATUS_CODES } from "../../src/constants.js";
import { SQSEvent } from "aws-lambda";
import { RepositoryError, TopicPublishError } from "../../src/errors.js";
import * as publish from "../../src/topic.js";
import {
  createdBatchProducts,
  mockTopicArn,
  sqsEvent,
  sqsProducts,
} from "./setup.js";

const mocks = vi.hoisted(() => {
  return {
    createManyProducts: vi.fn(),
    SNSClient: {
      send: vi.fn(),
    },
    PublishCommand: vi.fn(),
  };
});

vi.mock("../../src/repository.js", () => {
  return {
    createManyProducts: mocks.createManyProducts,
  };
});

vi.mock("@aws-sdk/client-sns", () => {
  return {
    SNSClient: vi.fn().mockImplementationOnce(() => {
      return {
        send: mocks.SNSClient.send,
      };
    }),
    PublishCommand: mocks.PublishCommand,
  };
});

const publishProductsSpy = vi.spyOn(publish, "publishProducts");

describe("Unit tests for batch products creation handler", () => {
  test("Create many products (successfully)", async () => {
    mocks.createManyProducts.mockResolvedValueOnce(createdBatchProducts);

    mocks.SNSClient.send.mockImplementationOnce(() => {
      return {
        $metadata: {
          httpStatusCode: HTTP_STATUS_CODES.OK,
        },
      };
    });

    await createManyProducts(sqsEvent);
    expect(mocks.createManyProducts).toHaveBeenCalledOnce();
    expect(mocks.createManyProducts).toHaveBeenCalledWith(sqsProducts);
    expect(mocks.SNSClient.send).toHaveBeenCalledOnce();
    expect(publishProductsSpy).toHaveBeenCalledOnce();
    expect(publishProductsSpy).toHaveBeenCalledWith(
      mockTopicArn,
      createdBatchProducts,
    );
  });

  test("Create many products (skip: no products in payload)", async () => {
    const event = <SQSEvent>{
      Records: [],
    };
    await createManyProducts(event);
    expect(mocks.createManyProducts).not.toHaveBeenCalled();
    expect(publishProductsSpy).not.toHaveBeenCalled();
  });

  test("Create many products (repository error)", async () => {
    mocks.createManyProducts.mockRejectedValueOnce(new RepositoryError());

    await createManyProducts(sqsEvent);
    expect(mocks.createManyProducts).toHaveBeenCalledOnce();
    expect(mocks.createManyProducts).toHaveBeenCalledWith(sqsProducts);
    expect(publishProductsSpy).not.toHaveBeenCalled();
  });

  test("Create many products (failed: topic publish error)", async () => {
    mocks.createManyProducts.mockResolvedValueOnce(createdBatchProducts);

    mocks.SNSClient.send.mockImplementationOnce(() => {
      return {
        $metadata: {
          httpStatusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
        },
      };
    });

    await createManyProducts(sqsEvent);
    const publishResult = publishProductsSpy.mock.results.pop();
    expect(publishProductsSpy).toHaveBeenCalledOnce();
    expect(publishResult?.value).toBeInstanceOf(TopicPublishError);
  });
});
