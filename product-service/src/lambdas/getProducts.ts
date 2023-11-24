import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  ProductApiFailedResponse,
  AvailableProduct,
  Product,
  DBScanOutput,
  DBQueryOutput,
  Stock,
} from "../types";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: get all products, event: ${JSON.stringify(event)}`);

  try {
    const dbClient = new DynamoDBClient();
    const { Items: productItems } = (await dbClient.send(
      new ScanCommand({
        TableName: process.env.PRODUCTS_TABLE_NAME,
      }),
    )) as DBScanOutput<Product>;

    const { Items: stockItems } = (await dbClient.send(
      new ScanCommand({
        TableName: process.env.STOCKS_TABLE_NAME,
      }),
    )) as DBQueryOutput<Stock>;

    const products = productItems ?? [];
    const stocks = stockItems ?? [];

    const availableProducts = products.map((p) => {
      const stock = stocks.find((s) => s.productId === p.id);
      return <AvailableProduct>{
        ...p,
        count: stock?.count || 0,
      };
    });
    return enableCors({
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(availableProducts),
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
