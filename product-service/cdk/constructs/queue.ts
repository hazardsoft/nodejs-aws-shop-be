import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { Queue, QueueEncryption } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'
import { queue } from '../config.js'

export class ProductServiceQueue extends Construct {
  public readonly queue: Queue

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.queue = new Queue(this, 'ProductServiceQueue', {
      queueName: queue.name,
      retentionPeriod: Duration.days(queue.retentionPeriodInDays),
      receiveMessageWaitTime: Duration.seconds(queue.receiveMessageWaitTimeInSeconds),
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
    this.queue.grantConsumeMessages(handler)
    handler.addEventSource(
      new SqsEventSource(this.queue, {
        batchSize: queue.batchSize,
        maxBatchingWindow: Duration.seconds(queue.maxBatchingWindowInSeconds)
      })
    )
  }
}
