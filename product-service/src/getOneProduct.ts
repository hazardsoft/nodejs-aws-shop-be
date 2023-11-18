import { APIGatewayProxyResult } from "aws-lambda";
import { findOne } from "./repository";
import { APIGatewayEvent, ProductApiFailedResponse } from "./types";
import { enableCors } from "./cors";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult > => {
    console.log(`lambda: getOneProduct, event: ${JSON.stringify(event)}`);

    const productId: string = event.pathParameters.id;
    if (!productId) {
        return {
            statusCode: 401,
            body: JSON.stringify(<ProductApiFailedResponse>{
                errorCode: 401,
                message: "Product id is not defined"
            })
        };
    }

    const product = await findOne(productId);
    if (!product) {
        return {
            statusCode: 404,
            body: JSON.stringify(<ProductApiFailedResponse>{
                errorCode: 404,
                message: "Product Not Found"
            })
        }
    }

    return enableCors({
        statusCode: 200,
        body: JSON.stringify(product)
    })
}