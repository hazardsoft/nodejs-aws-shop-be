import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  AvailableProduct,
  ProductApiFailedResponse,
  ProductInput,
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
        errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
        message: "Product payload is absent or incorrect",
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
        errorCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
        message: "Internal Server Error",
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
