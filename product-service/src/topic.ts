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

  const noStocksProducts = products.some((p) => p.count === 0 || !p.count);
  const publishResult = await snsClient.send(
    new PublishCommand({
      TopicArn: topicArn,
      Message: `Products are added successfully:\n${JSON.stringify(products)}`,
      MessageAttributes: {
        noStock: {
          DataType: "Number",
          StringValue: Number(noStocksProducts).toString(),
        },
      },
      Subject: `New products are added (${products.length})${
        noStocksProducts ? "(some products w/o stock)" : ""
      }`,
    }),
  );
  console.log(
    `products are published into topic with ${publishResult.$metadata.httpStatusCode} status code`,
  );
  if (publishResult.$metadata.httpStatusCode !== HTTP_STATUS_CODES.OK) {
    throw new TopicPublishError();
  }
};
