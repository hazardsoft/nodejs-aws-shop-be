import { vi } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { AvailableProduct, ProductInput } from "../../src/types";
import { SQSEvent } from "aws-lambda";

export const mockTopicArn = "mock-topic-arn";
vi.stubEnv("PRODUCTS_TOPIC_ARN", mockTopicArn);

export const mockAvailableProduct: AvailableProduct = {
  id: uuidv4(),
  title: "mock title",
  description: "mock description",
  price: 100,
  count: 15,
};

export const productDao = <ProductInput>{
  title: mockAvailableProduct.title,
  description: mockAvailableProduct.description,
  price: mockAvailableProduct.price,
  count: mockAvailableProduct.count,
};

export const sqsProducts = Array.from({ length: 2 }, () => productDao);
export const createdBatchProducts = sqsProducts.map((record) => {
  return <AvailableProduct>{
    id: uuidv4(),
    ...record,
  };
});

export const sqsEvent = <SQSEvent>{
  Records: sqsProducts.map((record) => {
    return {
      messageId: uuidv4(),
      body: JSON.stringify(record),
    };
  }),
};
