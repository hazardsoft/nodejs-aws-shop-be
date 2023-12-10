import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { AvailableProduct } from "./types";
import { TopicPublishError } from "./errors";
import { HTTP_STATUS_CODES } from "./constants";

const snsClient = new SNSClient();

export const publishProducts = async (
  topicArn: string,
  products: AvailableProduct[],
): Promise<void> => {
  console.log(`publishing products to topic ${topicArn}`);
  const publishResult = await snsClient.send(
    new PublishCommand({
      TopicArn: topicArn,
      Message: `Products are added successfully:\n${JSON.stringify(products)}`,
    }),
  );
  console.log(
    `products are published into topic with ${publishResult.$metadata.httpStatusCode} status code`,
  );
  if (publishResult.$metadata.httpStatusCode !== HTTP_STATUS_CODES.OK) {
    throw new TopicPublishError();
  }
};
