import { Cors } from "aws-cdk-lib/aws-apigateway";
import { CorsHttpMethod, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpUrlIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";

type BffServiceApiProps = {
  serverUrl: string;
};
export class BffServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: BffServiceApiProps) {
    super(scope, id);

    const proxyIntegration = new HttpUrlIntegration(
      "BffServerIntegration",
      props.serverUrl,
    );

    new HttpApi(this, "BffServiceApi", {
      apiName: "BffServiceApi",
      description: "HTTP proxy to access EB EC2 instance via HTTPS",
      defaultIntegration: proxyIntegration,
      corsPreflight: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.PUT,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
      },
    });
  }
}
