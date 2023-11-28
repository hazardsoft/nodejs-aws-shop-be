import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ProductApiFailedResponse,
  ProductMessages,
  ServerMessages,
} from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { createOneProduct } from "../repository";
import { validateProductPayload } from "../utils/validate";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: create product, event: ${JSON.stringify(event)}`);

  if (!event.body) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ProductMessages.PRODUCT_EMPTY_PAYLOAD,
      }),
    });
  }

  try {
    const validationResult = validateProductPayload(event.body);
    if (!validationResult.success) {
      return enableCors({
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify(<ProductApiFailedResponse>{
          message: ProductMessages.PRODUCT_INVALID_PAYLOAD,
          reason: validationResult.issues.toString(),
        }),
      });
    }

    const createdProduct = await createOneProduct(validationResult.data);

    return enableCors({
      statusCode: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify(createdProduct),
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
