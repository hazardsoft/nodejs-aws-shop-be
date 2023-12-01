import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ImportApiFailedResponse,
  ImportMessages,
  ServerMessages,
} from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";
import { validateImportProducts } from "../utils/validate";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    const s3Client = new S3Client();
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `uploaded/${productsFileName}`,
    });
    const url = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 60,
    });

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
