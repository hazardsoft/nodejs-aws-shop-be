import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import {
  LambdaIntegration,
  LambdaIntegrationOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { config } from "./constants.js";
import { ResponseModels } from "./models.js";
import { MethodResponses } from "./responses.js";

type ImportServiceApiProps = {
  importProductsFileHandler: LambdaFunction;
};
export class ImportServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: ImportServiceApiProps) {
    super(scope, id);

    const integrationOptions = <LambdaIntegrationOptions>{
      allowTestInvoke: false,
    };
    const importProductsIntegration = new LambdaIntegration(
      props.importProductsFileHandler,
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

    const importResource = api.root.addResource("import");
    importResource.addMethod("GET", importProductsIntegration, {
      methodResponses: responses.importProductsResponses,
      requestParameters: {
        "method.request.querystring.name": true,
      },
    });
  }
}
