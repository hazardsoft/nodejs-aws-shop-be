import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findOne } from "../repositories/repository";
import { ProductApiFailedResponse } from "../types";
import { enableCors } from "../utils/cors";
import { HTTP_STATUS_CODES } from "../constants";

export const handler = async (event: Pick<APIGatewayProxyEvent, "pathParameters">): Promise<APIGatewayProxyResult > => {
    console.log(`lambda: getOneProduct, event: ${JSON.stringify(event)}`);

    const productId = event.pathParameters?.id?.trim();
    if (!productId) {
        return enableCors({
            statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
            body: JSON.stringify(<ProductApiFailedResponse>{
                errorCode: HTTP_STATUS_CODES.BAD_REQUEST,
                message: "Product id is not defined"
            })
        });
    }

    const product = await findOne(productId);
    if (!product) {
        return enableCors({
            statusCode: HTTP_STATUS_CODES.NOT_FOUND,
            body: JSON.stringify(<ProductApiFailedResponse>{
                errorCode: HTTP_STATUS_CODES.NOT_FOUND,
                message: "Product Not Found"
            })
        })
    }

    return enableCors({
        statusCode: HTTP_STATUS_CODES.OK,
        body: JSON.stringify(product)
    })
}