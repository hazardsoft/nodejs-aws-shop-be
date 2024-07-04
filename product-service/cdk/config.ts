export const env = {
  PRODUCTS_TABLE_NAME: 'Products',
  STOCKS_TABLE_NAME: 'Stocks'
}

export const queue = {
  name: 'catalogItemsQueue',
  retentionPeriodInDays: 1,
  receiveMessageWaitTimeInSeconds: 10,
  batchSize: 5,
  maxBatchingWindowInSeconds: 10
}
