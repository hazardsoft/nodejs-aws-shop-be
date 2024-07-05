export const config = {
  db: {
    productsTableName: 'Products',
    stocksTableName: 'Stocks'
  },
  queue: {
    name: 'catalogItemsQueue',
    retentionPeriodInDays: 1,
    receiveMessageWaitTimeInSeconds: 0,
    batchSize: 5,
    maxBatchingWindowInSeconds: 10
  },
  topic: {
    name: 'createProductTopic',
    email: process.env.TOPIC_SUBSCRIPTION_EMAIL ?? '',
    lowStockEmail: process.env.TOPIC_SUBSCRIPTION_EMAIL_LOW_STOCK ?? ''
  }
}
