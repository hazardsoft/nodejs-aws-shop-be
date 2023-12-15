import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib/core";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { ComponentsIds, SharedCdkConfig } from "../../shared/constants";

export class ProductsQueue extends Construct {
  public readonly queue: Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.queue = new Queue(this, "ProductsQueue", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, "ProductsQueueUrl", {
      value: this.queue.queueUrl,
      exportName: <string>ComponentsIds.productsQueueUrl,
    });

    new CfnOutput(this, "ProductsQueueArn", {
      value: this.queue.queueArn,
      exportName: <string>ComponentsIds.productsQueueArn,
    });
  }

  registerConsumer(consumer: IFunction): void {
    consumer.addEventSource(
      new SqsEventSource(this.queue, {
        batchSize: SharedCdkConfig.queueBatchSize,
      }),
    );
  }
}
