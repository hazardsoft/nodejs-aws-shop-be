import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    console.log('ProductService')
  }
}

const productService = new ProductService(new App(), 'ProductService')
export { productService }
