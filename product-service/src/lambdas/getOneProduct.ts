import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  AvailableProduct,
  DBQueryOutput,
  Product,
  ProductApiFailedResponse,
  Stock,
} from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (
  event: Pick<APIGatewayProxyEvent, "pathParameters">,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: getOneProduct, event: ${JSON.stringify(event)}`);

  const productId = event.pathParameters?.id?.trim();
  if (!productId) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(<ProductApiFailedResponse>{
        errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
        message: "Product id is not defined",
      }),
    });
  }

  try {
    const dbClient = new DynamoDBClient();
    const { Items: productItems } = (await dbClient.send(
      new QueryCommand({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": { S: productId },
        },
      }),
    )) as DBQueryOutput<Product>;

    const product = productItems ? productItems[0] : null;
    if (!product) {
      return enableCors({
        statusCode: HTTP_STATUS_CODES.NOT_FOUND,
        body: JSON.stringify(<ProductApiFailedResponse>{
          errorCode: HTTP_STATUS_CODES.NOT_FOUND,
          message: "Product Not Found",
        }),
      });
    }

    const { Items: stockItems } = (await dbClient.send(
      new QueryCommand({
        TableName: process.env.STOCKS_TABLE_NAME,
        KeyConditionExpression: "productId = :productId",
        ExpressionAttributeValues: {
          ":productId": { S: productId },
        },
      }),
    )) as DBQueryOutput<Stock>;

    const stock = stockItems?.find((s) => s.productId === productId);
    const availableProduct: AvailableProduct = {
      ...product,
      count: stock?.count || 0,
    };

    return enableCors({
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(availableProduct),
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
