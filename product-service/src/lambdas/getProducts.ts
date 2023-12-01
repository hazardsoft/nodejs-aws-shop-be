import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { ProductApiFailedResponse, ServerMessages } from "../types";
import { getAllProducts } from "../repository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: get all products, event: ${JSON.stringify(event)}`);

  try {
    const availableProducts = await getAllProducts();
    return enableCors({
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(availableProducts),
    });
  } catch (e) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason: e instanceof Error ? e.message : "",
      }),
    });
  }
};
