import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ProductServiceHandlers } from './constructs/handlers.js'
import { ProductServiceApi } from './constructs/api.js'
import { ProductServiceDB } from './constructs/db.js'
import { ProductServiceQueue } from './constructs/queue.js'
import { ProductServiceTopic } from './constructs/topic.js'
import { config } from './config.js'
class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const topicConstruct = new ProductServiceTopic(this, 'ProductServiceTopic', {
      displayName: config.topic.name
    })
    topicConstruct.addEmailSubscription(config.topic.email)

    const { getManyProducts, getOneProduct, createOneProduct, catalogBatchProcess } =
      new ProductServiceHandlers(this, 'ProductServiceHandlers', {
        productsTableName: config.db.productsTableName,
        stocksTableName: config.db.stocksTableName,
        topicArn: topicConstruct.topic.topicArn
      })
    topicConstruct.addNotifier(catalogBatchProcess)

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
        createOneProduct,
        createManyProducts: catalogBatchProcess
      },
      productsTableName: config.db.productsTableName,
      stocksTableName: config.db.stocksTableName
    })

    const queue = new ProductServiceQueue(this, 'ProductServiceQueue')
    queue.addTrigger(catalogBatchProcess)
  }
}

const productService = new ProductService(new App(), 'ProductService')
export { productService }
