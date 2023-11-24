import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductInput,
} from "../types";
import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { randomUUID } from "node:crypto";

const productsTableName: string = process.env.PRODUCTS_TABLE_NAME ?? "";
const stocksTableName: string = process.env.STOCKS_TABLE_NAME ?? "";

export const createProduct = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: create product, event: ${JSON.stringify(event)}`);

  if (!event.body || validateRequest(event.body)) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(<ProductApiFailedResponse>{
        errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
        message: "Product payload is absent or incorrect",
      }),
    });
  }

  try {
    const productInput = JSON.parse(event.body) as ProductInput;
    const dbClient = new DynamoDBClient();
    const newProductId: string = randomUUID();

    await dbClient.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: productsTableName,
              Item: {
                id: { S: newProductId },
                title: { S: productInput.title },
                description: { S: productInput.description },
                price: { N: productInput.price.toString() },
              },
            },
          },
          {
            Put: {
              TableName: stocksTableName,
              Item: {
                product_id: { S: newProductId },
                count: {
                  N: productInput.count.toString(),
                },
              },
            },
          },
        ],
      }),
    );

    return enableCors({
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(<AvailableProduct>{
        id: newProductId,
        ...productInput,
      }),
    });
  } catch (e) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        errorCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
        message: "Internal Server Error",
      }),
    });
  }
};

const validateRequest = (body: string): boolean => {
  const availableProduct = JSON.parse(body) as AvailableProduct;
  return (
    !availableProduct.title ||
    !availableProduct.description ||
    !availableProduct.price ||
    !availableProduct.count
  );
};
