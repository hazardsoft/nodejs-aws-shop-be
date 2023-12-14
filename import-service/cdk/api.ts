import { Function as LambdaFunction, IFunction } from "aws-cdk-lib/aws-lambda";
import {
  AuthorizationType,
  LambdaIntegration,
  LambdaIntegrationOptions,
  RestApi,
  TokenAuthorizer,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { config } from "./constants.js";
import { ResponseModels } from "./models.js";
import { MethodResponses } from "./responses.js";

type ImportServiceApiProps = {
  importProductsHandler: LambdaFunction;
  basicAuthHandler: IFunction;
};
export class ImportServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: ImportServiceApiProps) {
    super(scope, id);

    const integrationOptions = <LambdaIntegrationOptions>{
      allowTestInvoke: false,
    };
    const importProductsIntegration = new LambdaIntegration(
      props.importProductsHandler,
      integrationOptions,
    );

    const api = new RestApi(this, "ImportServiceApi", {
      restApiName: "Import",
      deployOptions: {
        stageName: config.stageName,
      },
    });

    const models = new ResponseModels(this, "ResponseModels", {
      restApi: api,
    });
    const responses = new MethodResponses(this, "MethodResponses", {
      models: {
        importProductsModel: models.importProductsModel,
        importErrorModel: models.importProductsErrorModel,
      },
    });

    const tokenAuthorizer = new TokenAuthorizer(this, "BasicAuthorizer", {
      handler: props.basicAuthHandler,
    });

    const importResource = api.root.addResource("import");
    importResource.addMethod("GET", importProductsIntegration, {
      methodResponses: responses.importProductsResponses,
      requestParameters: {
        "method.request.querystring.name": true,
      },
      authorizationType: AuthorizationType.CUSTOM,
      authorizer: tokenAuthorizer,
    });
  }
}
