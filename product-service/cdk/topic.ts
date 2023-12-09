import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Subscription, Topic, SubscriptionProtocol } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export class ProductsTopic extends Construct {
  public readonly topic: Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new Topic(this, "ProductsTopic", {
      displayName: "Topic to notify users via email about newly added products",
    });
  }

  registerPublisher(handler: IFunction): void {
    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ["sns:Publish"],
        resources: [this.topic.topicArn],
        effect: Effect.ALLOW,
      }),
    );
  }

  registerSubscriber(email: string): void {
    new Subscription(this, `ProductsTopicSubscriber-${email}`, {
      protocol: SubscriptionProtocol.EMAIL,
      topic: this.topic,
      endpoint: email,
    });
  }
}
