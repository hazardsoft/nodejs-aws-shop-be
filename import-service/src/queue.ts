import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { HTTP_STATUS_CODES } from "./constants";
import { SendMessageError } from "./errors";
import { Product } from "./types";

const sqsClient = new SQSClient();

export const sendMessageBatch = async (
  queueUrl: string,
  products: Product[],
): Promise<void> => {
  console.log(
    `Sending batch message to queue ${queueUrl}, products: ${JSON.stringify(
      products,
    )}`,
  );
  const queueResult = await sqsClient.send(
    new SendMessageBatchCommand({
      QueueUrl: queueUrl,
      Entries: products.map((product, index) => {
        return {
          Id: index.toString(),
          MessageBody: JSON.stringify(product),
        };
      }),
    }),
  );

  console.log(
    `Message sent with status code ${queueResult.$metadata.httpStatusCode}`,
  );
  if (queueResult.$metadata.httpStatusCode !== HTTP_STATUS_CODES.OK) {
    throw new SendMessageError();
  }
};
