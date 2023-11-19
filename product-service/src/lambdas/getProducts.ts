import { APIGatewayProxyResult } from "aws-lambda";
import { findAll } from "../repositories/repository";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";

export const handler = async (): Promise<APIGatewayProxyResult> => {
    console.log(`lambda: getProducts`);
    const products = await findAll();
    return enableCors({
        statusCode: HTTP_STATUS_CODES.OK,
        body: JSON.stringify(products),
    })
}