import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { RemovalPolicy } from "aws-cdk-lib/core";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class ProductsQueue extends Construct {
  public readonly queue: Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.queue = new Queue(this, "ProductsQueue", {
      fifo: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  registerProducer(producer: LambdaFunction) {
    this.queue.addToResourcePolicy(
      new PolicyStatement({
        actions: ["sqs:SendMessage"],
        resources: [this.queue.queueArn],
        principals: [producer.grantPrincipal],
        effect: Effect.ALLOW,
      }),
    );
  }
}
