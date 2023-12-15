import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { HTTP_STATUS_CODES } from "./constants";
import { SendMessageError } from "./errors";
import { Product } from "./types";

const sqsClient = new SQSClient();
const MAX_MESSAGES_IN_BATCH = 10;

const sendMessageBatch_internal = async (
  queueUrl: string,
  products: Product[],
): Promise<void> => {
  console.log(`Sending batch message with x${products.length} products`);
  const sendBatchResult = await sqsClient.send(
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
    `Message sent with status code ${sendBatchResult.$metadata.httpStatusCode}`,
  );
  if (sendBatchResult.$metadata.httpStatusCode !== HTTP_STATUS_CODES.OK) {
    throw new SendMessageError();
  }
};

export const sendMessageBatch = async (
  queueUrl: string,
  products: Product[],
): Promise<void> => {
  if (!products.length) {
    console.log(`No products to send to queue ${queueUrl}`);
    return;
  }

  const batchesCount = Math.ceil(products.length / MAX_MESSAGES_IN_BATCH);
  console.log(
    `Sending (${batchesCount}) batch(es) of total x${products.length} messages to queue ${queueUrl}`,
  );
  const batchesPromises = [];
  for (let i = 0; i < batchesCount; i++) {
    const batch = products.slice(
      i * MAX_MESSAGES_IN_BATCH,
      (i + 1) * MAX_MESSAGES_IN_BATCH,
    );
    batchesPromises.push(sendMessageBatch_internal(queueUrl, batch));
  }
  await Promise.allSettled(batchesPromises);
  console.log(`All batches sent to queue ${queueUrl} successfully`);
};
