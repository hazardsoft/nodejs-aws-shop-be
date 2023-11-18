import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { Cors, LambdaIntegration, LambdaIntegrationOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib/core";

export class ProductsApi extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const getAllProducts = new Function(this, "GetAllProducts", {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset("./dist/lambdas/getProducts"),
            handler: "getProducts.handler"
        })

        const getOneProduct = new Function(this, "GetOneProduct", {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset("./dist/lambdas/getOneProduct"),
            handler: "getOneProduct.handler"
        })

        const integrationOptions = <LambdaIntegrationOptions>{
            allowTestInvoke: true,
        }
        const getAllProductsIntegration = new LambdaIntegration(getAllProducts, integrationOptions);
        const getOneProductIntegration = new LambdaIntegration(getOneProduct, integrationOptions);

        const api = new RestApi(this, "ProductApi", {
            restApiName: "Products",
            deployOptions: {
                stageName: "dev",
            },
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: ["GET", "OPTIONS"]
            }
        });
        
        const products = api.root.addResource("products");
        products.addMethod("GET", getAllProductsIntegration);

        const oneProduct = products.addResource("{id}");
        oneProduct.addMethod("GET", getOneProductIntegration);

        new CfnOutput(this, "ApiUrl", {
            value: api.url
        })
    }
}