import { Fn } from 'aws-cdk-lib'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { type IQueue, Queue } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

export class ImportServiceQueue extends Construct {
  public readonly queue: IQueue

  constructor(scope: Construct, id: string) {
    super(scope, id)
    this.queue = Queue.fromQueueArn(this, 'ImportServiceQueue', Fn.importValue('ProductsQueueArn'))
  }

  grantSendMessages(handler: IFunction) {
    this.queue.grantSendMessages(handler)
  }
}
