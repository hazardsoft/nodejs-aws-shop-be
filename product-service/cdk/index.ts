import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ProductServiceHandlers } from './constructs/handlers.js'
import { ProductServiceApi } from './constructs/api.js'
class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const { getAllProducts, getOneProduct } = new ProductServiceHandlers(
      this,
      'ProductServiceHandlers'
    )
    new ProductServiceApi(this, 'ProductServiceApi', {
      handlers: {
        getAllProducts,
        getOneProduct
      }
    })
  }
}

const productService = new ProductService(new App(), 'ProductService')
export { productService }
