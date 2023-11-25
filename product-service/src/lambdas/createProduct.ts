import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductInput,
  ProductMessages,
  ServerMessages,
} from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { createOneProduct } from "../repository";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: create product, event: ${JSON.stringify(event)}`);

  if (!event.body || validateRequest(event.body)) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(<ProductApiFailedResponse>{
        message: ProductMessages.PRODUCT_INVALID_PAYLOAD,
      }),
    });
  }

  try {
    const productInput = JSON.parse(event.body) as ProductInput;
    const createdProduct = await createOneProduct(productInput);

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

const validateRequest = (body: string): boolean => {
  const availableProduct = JSON.parse(body) as AvailableProduct;
  return (
    !!availableProduct.id ||
    !availableProduct.title ||
    !availableProduct.description ||
    !availableProduct.price ||
    !availableProduct.count
  );
};
