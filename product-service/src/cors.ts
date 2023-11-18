import { APIGatewayProxyResult } from "aws-lambda";

export const enableCors = (result: APIGatewayProxyResult): APIGatewayProxyResult => {
    result.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    return result;
}