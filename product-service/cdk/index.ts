import {App, Stack} from "aws-cdk-lib";
import { Construct } from "constructs";
import { ProductsApi } from "./api";

export class ProductService extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new ProductsApi(this, "ProductsApi");
    }
}

const app = new App();
new ProductService(app, "ProductsService");