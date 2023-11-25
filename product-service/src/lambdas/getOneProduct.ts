import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ProductApiFailedResponse,
  ProductMessages,
  ServerMessages,
} from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { getOneProduct } from "../repository";
import { ProductNotFoundError } from "../errors";

export const handler = async (
  event: Pick<APIGatewayProxyEvent, "pathParameters">,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: getOneProduct, event: ${JSON.stringify(event)}`);

  const productId = event.pathParameters?.id?.trim();
  if (!productId) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ProductMessages.PRODUCT_INVALID_ID,
      }),
    });
  }

  try {
    const availableProduct = await getOneProduct(productId);
    return enableCors({
      statusCode: HTTP_STATUS_CODES.OK,
      body: JSON.stringify(availableProduct),
    });
  } catch (e) {
    if (e instanceof ProductNotFoundError) {
      return enableCors({
        statusCode: HTTP_STATUS_CODES.NOT_FOUND,
        body: JSON.stringify(<ProductApiFailedResponse>{
          message: ProductMessages.PRODUCT_NOT_FOUND,
        }),
      });
    }
    return enableCors({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason: e instanceof Error ? e.message : "",
      }),
    });
  }
};
