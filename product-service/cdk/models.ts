import { Fn } from "aws-cdk-lib"
import { JsonSchemaType, Model, RestApi } from "aws-cdk-lib/aws-apigateway"

const createOneProductResponse = (api: RestApi): Model => {
    return api.addModel("OneProductModel", {
        contentType: "application/json",
        modelName: "OneProductModel",
        schema: {
            title: "Product",
            type: JsonSchemaType.OBJECT,
            properties: {
                id: { type: JsonSchemaType.STRING },
                title: { type: JsonSchemaType.STRING },
                description: { type: JsonSchemaType.STRING },
                price: { type: JsonSchemaType.INTEGER },
            },
            required: ["id", "title", "description", "price"]
        }
    })
}

const createOneProductErrorResponse = (api: RestApi): Model => {
    return api.addModel("OneProductInvalidIdModel", {
        contentType: "application/json",
        modelName: "OneProductInvalidIdModel",
        schema: {
            title: "Error",
            type: JsonSchemaType.OBJECT,
            properties: {
                errorCode: { type: JsonSchemaType.INTEGER },
                message: { type: JsonSchemaType.STRING },
            },
            required: ["errorCode", "message"]
        }
    })
}

const createAllProductsResponse = (api: RestApi, oneProductModel:Model): Model => {
    return api.addModel("AllProductsModel", {
        contentType: "application/json",
        modelName: "AllProductsModel",
        schema: {
            title: "Products",
            type: JsonSchemaType.ARRAY,
            items: {
                ref: getModelRef(api, oneProductModel)
            }
        }
    })
}

const getModelRef = (api: RestApi, model: Model): string => 
    Fn.join(
        '',
        ['https://apigateway.amazonaws.com/restapis/',
        api.restApiId,
        '/models/',
            model.modelId]);
    
let oneProductModel: Model;
let oneProductErrorModel: Model;
let allProductsModel: Model;

export const getModels = (api: RestApi) => {
    oneProductModel = oneProductModel ?? createOneProductResponse(api);
    oneProductErrorModel = oneProductErrorModel ?? createOneProductErrorResponse(api);
    allProductsModel = allProductsModel ?? createAllProductsResponse(api, oneProductModel);

    return {
        oneProductModel,
        oneProductErrorModel,
        allProductsModel
    }
}