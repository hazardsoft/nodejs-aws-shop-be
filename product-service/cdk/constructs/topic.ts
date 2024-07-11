import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { SubscriptionFilter, Topic } from 'aws-cdk-lib/aws-sns'
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions'
import { Construct } from 'constructs'

interface ProductServiceTopicProps {
  displayName: string
}
export class ProductServiceTopic extends Construct {
  public readonly topic: Topic

  constructor(scope: Construct, id: string, props: ProductServiceTopicProps) {
    super(scope, id)

    this.topic = new Topic(this, 'ProductServiceTopic', {
      displayName: props.displayName
    })
  }

  addEmailSubscription(email: string) {
    this.topic.addSubscription(new EmailSubscription(email))
  }

  addLowStockEmailSubscription(email: string) {
    this.topic.addSubscription(
      new EmailSubscription(email, {
        filterPolicy: {
          stockStatus: SubscriptionFilter.stringFilter({ allowlist: ['some_out_of_stock'] })
        }
      })
    )
  }

  addNotifier(handler: IFunction) {
    this.topic.grantPublish(handler)
  }
}
