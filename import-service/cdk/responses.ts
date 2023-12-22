import { MethodResponse, Model } from "aws-cdk-lib/aws-apigateway";
import { HTTP_STATUS_CODES } from "../src/constants.js";
import { Construct } from "constructs";

export type MethodResponsesProps = {
  models: {
    importProductsModel: Model;
    importErrorModel: Model;
  };
};

export class MethodResponses extends Construct {
  public readonly importProductsResponses: MethodResponse[];

  constructor(scope: Construct, id: string, props: MethodResponsesProps) {
    super(scope, id);

    this.importProductsResponses = createImportProductsMethodResponses(props);
  }
}

export const createImportProductsMethodResponses = (
  props: MethodResponsesProps,
): MethodResponse[] => {
  const responseParameters = {
    "method.response.header.Access-Control-Allow-Origin": true,
  };

  return [
    {
      statusCode: `${HTTP_STATUS_CODES.OK}`,
      responseModels: {
        "text/plain": props.models.importProductsModel,
      },
      responseParameters,
    },
    {
      statusCode: `${HTTP_STATUS_CODES.BAD_REQUEST}`,
      responseModels: {
        "application/json": props.models.importErrorModel,
      },
      responseParameters,
    },
    {
      statusCode: `${HTTP_STATUS_CODES.INTERNAL_SERVER}`,
      responseModels: {
        "application/json": props.models.importErrorModel,
      },
      responseParameters,
    },
  ];
};
