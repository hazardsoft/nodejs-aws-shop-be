export const ComponentsIds = {
    productsQueueUrl: "ProductsQueueUrl",
    productsQueueArn: "ProductsQueueArn",
    authorizerLambdaArn: "AuthorizerLambdaArn",
} as const;

export const SharedCdkConfig = {
    queueBatchSize: 5
} as const;