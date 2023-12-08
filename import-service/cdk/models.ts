import { JsonSchemaType, Model, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export type ResponseModelsProps = {
  restApi: RestApi;
};

export class ResponseModels extends Construct {
  public readonly importProductsModel: Model;
  public readonly importProductsErrorModel: Model;

  constructor(scope: Construct, id: string, props: ResponseModelsProps) {
    super(scope, id);

    this.importProductsModel = createImportProductsModel(this, props);
    this.importProductsErrorModel = createImportProductsErrorModel(this, props);
  }
}

export const createImportProductsModel = (
  scope: Construct,
  props: ResponseModelsProps,
): Model => {
  return new Model(scope, "RequestImportProductsModel", {
    restApi: props.restApi,
    contentType: "text/plain",
    modelName: "RequestImportProductsModel",
    schema: {
      title: "SignedUrl",
      type: JsonSchemaType.STRING,
    },
  });
};

const createImportProductsErrorModel = (
  scope: Construct,
  props: ResponseModelsProps,
): Model => {
  return new Model(scope, "ImportProductsErrorModel", {
    restApi: props.restApi,
    contentType: "application/json",
    modelName: "ImportProductsErrorModel",
    schema: {
      title: "Error",
      type: JsonSchemaType.OBJECT,
      properties: {
        message: { type: JsonSchemaType.STRING },
      },
      required: ["message"],
    },
  });
};
