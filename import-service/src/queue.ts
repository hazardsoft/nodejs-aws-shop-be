import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { HTTP_STATUS_CODES } from "./constants";
import { SendMessageError } from "./errors";

const sqsClient = new SQSClient();

export const sendMessage = async (
  queueUrl: string,
  payload: unknown,
): Promise<void> => {
  console.log(
    `Sending message to queue ${queueUrl}, payload ${JSON.stringify(payload)}`,
  );
  const queueResult = await sqsClient.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
    }),
  );

  console.log(
    `Message sent with status code ${queueResult.$metadata.httpStatusCode}`,
  );
  if (queueResult.$metadata.httpStatusCode !== HTTP_STATUS_CODES.OK) {
    throw new SendMessageError();
  }
};
