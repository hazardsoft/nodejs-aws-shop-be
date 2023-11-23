import { MethodResponse, RestApi } from "aws-cdk-lib/aws-apigateway";
import { HTTP_STATUS_CODES } from "../src/constants.js";
import {getModels} from "./models.js";

export const getOneProductMethodResponses = (api: RestApi): MethodResponse[] => {
    const models = getModels(api);    

    return [
        {
            statusCode: `${HTTP_STATUS_CODES.OK}`,
            responseModels: {
                "application/json": models.oneProductModel
            }
        },
        {
            statusCode: `${HTTP_STATUS_CODES.BAD_REQUEST}`,
            responseModels: {
                "application/json": models.oneProductErrorModel
            }
        },
        {
            statusCode: `${HTTP_STATUS_CODES.NOT_FOUND}`,
            responseModels: {
                "application/json": models.oneProductErrorModel
            }
        },
    ]
}

export const getAllProductsMethodResponses = (api: RestApi): MethodResponse[] => {
    const models = getModels(api);

    return [
        {
            statusCode: `${HTTP_STATUS_CODES.OK}`,
            responseModels: {
                "application/json": models.allProductsModel
            }
        },
    ]
}