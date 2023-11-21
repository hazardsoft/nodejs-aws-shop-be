import { MethodResponse, Model } from "aws-cdk-lib/aws-apigateway";
import { HTTP_STATUS_CODES } from "../src/constants.js";
import { Construct } from "constructs";

export type MethodResponsesProps = {
  models: {
    oneProductModel: Model;
    allProductsModel: Model;
    productErrorModel: Model;
  };
};

export class MethodResponses extends Construct {
  public readonly getOneProductMethodResponses: MethodResponse[];
  public readonly getAllProductsMethodResponses: MethodResponse[];
  public readonly createOneProductMethodResponses: MethodResponse[];

  constructor(scope: Construct, id: string, props: MethodResponsesProps) {
    super(scope, id);

    this.getOneProductMethodResponses =
      createGetOneProductMethodResponses(props);
    this.getAllProductsMethodResponses = getAllProductsMethodResponses(props);
    this.createOneProductMethodResponses = createProductMethodResponses(props);
  }
}

export const createGetOneProductMethodResponses = (
  props: MethodResponsesProps,
): MethodResponse[] => {
  return [
    {
      statusCode: `${HTTP_STATUS_CODES.OK}`,
      responseModels: {
        "application/json": props.models.oneProductModel,
      },
    },
    {
      statusCode: `${HTTP_STATUS_CODES.BAD_REQUEST}`,
      responseModels: {
        "application/json": props.models.productErrorModel,
      },
    },
    {
      statusCode: `${HTTP_STATUS_CODES.NOT_FOUND}`,
      responseModels: {
        "application/json": props.models.productErrorModel,
      },
    },
    {
      statusCode: `${HTTP_STATUS_CODES.INTERNAL_SERVER}`,
      responseModels: {
        "application/json": props.models.productErrorModel,
      },
    },
  ];
};

export const getAllProductsMethodResponses = (
  props: MethodResponsesProps,
): MethodResponse[] => {
  return [
    {
      statusCode: `${HTTP_STATUS_CODES.OK}`,
      responseModels: {
        "application/json": props.models.allProductsModel,
      },
    },
    {
      statusCode: `${HTTP_STATUS_CODES.INTERNAL_SERVER}`,
      responseModels: {
        "application/json": props.models.productErrorModel,
      },
    },
  ];
};

export const createProductMethodResponses = (
  props: MethodResponsesProps,
): MethodResponse[] => {
  return [
    {
      statusCode: `${HTTP_STATUS_CODES.CREATED}`,
      responseModels: {
        "application/json": props.models.oneProductModel,
      },
    },
    {
      statusCode: `${HTTP_STATUS_CODES.INTERNAL_SERVER}`,
      responseModels: {
        "application/json": props.models.productErrorModel,
      },
    },
  ];
};
