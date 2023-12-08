import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib/core";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { ComponentsIds, SharedCdkConfig } from "../../shared/constants";

export class ProductsQueue extends Construct {
  public readonly queue: Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.queue = new Queue(this, "ProductsQueue", {
      fifo: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, "ProductsQueueUrl", {
      value: this.queue.queueUrl,
      exportName: <string>ComponentsIds.productsQueueUrl,
    });
  }

  registerProducer(producer: IFunction): void {
    producer.addToRolePolicy(
      new PolicyStatement({
        actions: ["sqs:SendMessage"],
        resources: [this.queue.queueArn],
        effect: Effect.ALLOW,
        conditions: {
          ArnEquals: {
            "aws:SourceArn": producer.functionArn,
          },
        },
      }),
    );
  }

  registerConsumer(consumer: IFunction): void {
    consumer.addEventSource(
      new SqsEventSource(this.queue, {
        batchSize: SharedCdkConfig.queueBatchSize,
      }),
    );
  }
}
