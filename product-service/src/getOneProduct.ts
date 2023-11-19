import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findOne } from "./repository";
import { ProductApiFailedResponse } from "./types";
import { enableCors } from "./cors";

export const handler = async (event: Pick<APIGatewayProxyEvent, "pathParameters">): Promise<APIGatewayProxyResult > => {
    console.log(`lambda: getOneProduct, event: ${JSON.stringify(event)}`);

    const productId = event.pathParameters?.id;
    if (!productId) {
        return enableCors({
            statusCode: 401,
            body: JSON.stringify(<ProductApiFailedResponse>{
                errorCode: 401,
                message: "Product id is not defined"
            })
        });
    }

    const product = await findOne(productId);
    if (!product) {
        return enableCors({
            statusCode: 404,
            body: JSON.stringify(<ProductApiFailedResponse>{
                errorCode: 404,
                message: "Product Not Found"
            })
        })
    }

    return enableCors({
        statusCode: 200,
        body: JSON.stringify(product)
    })
}