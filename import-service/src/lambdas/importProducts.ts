import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ImportApiFailedResponse,
  ImportMessages,
  ServerMessages,
} from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { validateImportProducts } from "../utils/validate";
import { generateSignedUrl } from "../bucket";
import { config } from "../../cdk/constants";

const bucketName = process.env.BUCKET_NAME ?? "";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(`lambda: import products file, event: ${JSON.stringify(event)}`);

  const productsFileName = event.queryStringParameters?.name;
  console.log(`filename to import: ${productsFileName}`);

  if (!productsFileName) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify(<ImportApiFailedResponse>{
        message: ImportMessages.FILENAME_EMPTY,
      }),
    });
  }

  try {
    const validationResult = validateImportProducts(productsFileName);
    if (!validationResult.success) {
      return enableCors({
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify(<ImportApiFailedResponse>{
          message: ImportMessages.FILENAME_INVALID,
          reason: validationResult.issues.toString(),
        }),
      });
    }

    const url = await generateSignedUrl(
      bucketName,
      `${config.bucketUploadedPrefix}/${productsFileName}`,
    );

    console.log(`Signed utl for put command: ${url}`);

    return enableCors({
      statusCode: HTTP_STATUS_CODES.ACCEPTED,
      body: url,
    });
  } catch (e) {
    return enableCors({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
      body: JSON.stringify(<ImportApiFailedResponse>{
        message: ServerMessages.INTERNAL_SERVER_ERROR,
        reason: e instanceof Error ? e.message : "",
      }),
    });
  }
};
