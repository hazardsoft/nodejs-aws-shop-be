import { APIGatewayProxyResult } from "aws-lambda";
import { findAll } from "./repository";
import { enableCors } from "./cors";

export const handler = async (): Promise<APIGatewayProxyResult> => {
    console.log(`lambda: getProducts`);
    const products = await findAll();
    return enableCors({
        statusCode: 200,
        body: JSON.stringify(products),
    })
}