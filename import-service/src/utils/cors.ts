import { APIGatewayProxyResult } from "aws-lambda";

export const enableCors = (
  result: APIGatewayProxyResult,
): APIGatewayProxyResult => {
  result.headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  };
  return result;
};
