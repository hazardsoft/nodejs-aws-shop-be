import { Function as LambdaFunction, IFunction } from "aws-cdk-lib/aws-lambda";
import {
  Cors,
  LambdaIntegration,
  LambdaIntegrationOptions,
  RestApi,
  TokenAuthorizer,
  ResponseType,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { config } from "./constants.js";
import { ResponseModels } from "./models.js";
import { MethodResponses } from "./responses.js";
import { Duration } from "aws-cdk-lib/core";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

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
    api.addGatewayResponse("GatewayResponseDefault4XX", {
      type: ResponseType.DEFAULT_4XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
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

    const assumedAuthRole = new Role(this, "TokenAuthorizerRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });
    assumedAuthRole.addToPolicy(
      new PolicyStatement({
        actions: ["lambda:InvokeFunction"],
        resources: [props.basicAuthHandler.functionArn],
      }),
    );

    const tokenAuthorizer = new TokenAuthorizer(this, "TokenAuthorizer", {
      handler: props.basicAuthHandler,
      resultsCacheTtl: Duration.seconds(0),
      assumeRole: assumedAuthRole,
    });

    const importResource = api.root.addResource("import");
    importResource.addMethod("GET", importProductsIntegration, {
      methodResponses: responses.importProductsResponses,
      requestParameters: {
        "method.request.querystring.name": true,
      },
      authorizer: tokenAuthorizer,
    });
    importResource.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowMethods: ["GET", "OPTIONS"],
    });
  }
}
