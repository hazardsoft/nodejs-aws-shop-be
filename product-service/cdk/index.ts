import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ProductServiceHandlers } from './constructs/handlers.js'
import { ProductServiceApi } from './constructs/api.js'
import { ProductServiceDB } from './constructs/db.js'
class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const { getManyProducts, getOneProduct, createOneProduct } = new ProductServiceHandlers(
      this,
      'ProductServiceHandlers'
    )
    new ProductServiceApi(this, 'ProductServiceApi', {
      handlers: {
        getManyProducts,
        getOneProduct,
        createOneProduct
      }
    })
    new ProductServiceDB(this, 'ProductServiceDB', {
      handlers: {
        getManyProducts,
        getOneProduct,
        createOneProduct
      }
    })
  }
}

const productService = new ProductService(new App(), 'ProductService')
export { productService }
