import { Fn } from "aws-cdk-lib";
import { JsonSchemaType, Model, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export type ResponseModelsProps = {
  restApi: RestApi;
};

export class ResponseModels extends Construct {
  public readonly oneProductModel: Model;
  public readonly allProductsModel: Model;
  public readonly createProductModel: Model;
  public readonly productErrorModel: Model;

  constructor(scope: Construct, id: string, props: ResponseModelsProps) {
    super(scope, id);

    this.oneProductModel = createOneProductModel(this, props);
    this.allProductsModel = createAllProductsModel(
      this,
      props,
      this.oneProductModel,
    );
    this.createProductModel = createRequestProductModel(this, props);
    this.productErrorModel = createProductErrorModel(this, props);
  }
}

const createOneProductModel = (
  scope: Construct,
  props: ResponseModelsProps,
): Model => {
  return new Model(scope, "OneProductModel", {
    restApi: props.restApi,
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
        count: { type: JsonSchemaType.INTEGER },
      },
      required: ["id", "title", "description", "price", "count"],
    },
  });
};

const createAllProductsModel = (
  scope: Construct,
  props: ResponseModelsProps,
  oneProductModel: Model,
): Model => {
  return new Model(scope, "AllProductsModel", {
    restApi: props.restApi,
    contentType: "application/json",
    modelName: "AllProductsModel",
    schema: {
      title: "Products",
      type: JsonSchemaType.ARRAY,
      items: {
        ref: getModelRef(props.restApi, oneProductModel),
      },
    },
  });
};

const createProductErrorModel = (
  scope: Construct,
  props: ResponseModelsProps,
): Model => {
  return new Model(scope, "ProductErrorModel", {
    restApi: props.restApi,
    contentType: "application/json",
    modelName: "ProductErrorModel",
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
export const createRequestProductModel = (
  scope: Construct,
  props: ResponseModelsProps,
): Model => {
  return new Model(scope, "RequestProductModel", {
    restApi: props.restApi,
    contentType: "application/json",
    modelName: "RequestProductModel",
    schema: {
      title: "ProductDao",
      type: JsonSchemaType.OBJECT,
      properties: {
        title: { type: JsonSchemaType.STRING },
        description: { type: JsonSchemaType.STRING },
        price: { type: JsonSchemaType.INTEGER },
        count: { type: JsonSchemaType.INTEGER },
      },
      required: ["title", "description", "price", "count"],
    },
  });
};

const getModelRef = (api: RestApi, model: Model): string =>
  Fn.join("", [
    "https://apigateway.amazonaws.com/restapis/",
    api.restApiId,
    "/models/",
    model.modelId,
  ]);
