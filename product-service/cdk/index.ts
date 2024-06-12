import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ProductServiceHandlers } from './constructs/handlers.js'
class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    new ProductServiceHandlers(this, 'ProductServiceHandlers')
  }
}

const productService = new ProductService(new App(), 'ProductService')
export { productService }
