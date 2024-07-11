import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { Queue, QueueEncryption } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'
import { config } from '../config.js'

export class ProductServiceQueue extends Construct {
  public readonly queue: Queue

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.queue = new Queue(this, 'ProductServiceQueue', {
      queueName: config.queue.name,
      retentionPeriod: Duration.days(config.queue.retentionPeriodInDays),
      receiveMessageWaitTime: Duration.seconds(config.queue.receiveMessageWaitTimeInSeconds),
      encryption: QueueEncryption.SQS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY
    })

    new CfnOutput(this, 'ProductsQueueArn', {
      value: this.queue.queueArn,
      description: 'ARN of Products SQS',
      exportName: 'ProductsQueueArn'
    })
  }

  addTrigger(handler: IFunction): void {
    handler.addEventSource(
      new SqsEventSource(this.queue, {
        batchSize: config.queue.batchSize,
        maxBatchingWindow: Duration.seconds(config.queue.maxBatchingWindowInSeconds)
      })
    )
  }
}
