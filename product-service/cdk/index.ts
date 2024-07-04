import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ProductServiceHandlers } from './constructs/handlers.js'
import { ProductServiceApi } from './constructs/api.js'
import { ProductServiceDB } from './constructs/db.js'
import { ProductServiceQueue } from './constructs/queue.js'
class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const { getManyProducts, getOneProduct, createOneProduct, catalogBatchProcess } =
      new ProductServiceHandlers(this, 'ProductServiceHandlers')

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

    const queue = new ProductServiceQueue(this, 'ProductServiceQueue')
    queue.addTrigger(catalogBatchProcess)
  }
}

const productService = new ProductService(new App(), 'ProductService')
export { productService }
