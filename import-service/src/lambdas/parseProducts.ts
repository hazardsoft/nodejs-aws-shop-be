import { S3Event } from "aws-lambda";
import { config } from "../../cdk/constants";
import { getObject, copyObject, deleteObject } from "../bucket";
import { readProducts } from "../utils/parser";
import { sendMessage } from "../queue";

const queueUrl = process.env.QUEUE_URL ?? "";

export const handler = async (event: S3Event): Promise<void> => {
  console.log(`lambda: products file parser, event: ${JSON.stringify(event)}`);

  for await (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const key = record.s3.object.key;
    console.log(`bucketName: ${bucketName}, key: ${key}`);

    const source = { bucketName, key };
    const stream = await getObject(source);
    const products = await readProducts(stream);
    console.log(`parsed products: ${JSON.stringify(products)}`);

    await sendMessage(queueUrl, products);

    await copyObject({
      from: source,
      to: {
        bucketName,
        key: `${key.replace(
          config.bucketUploadedPrefix,
          config.bucketParsedPrefix,
        )}`,
      },
    });
    await deleteObject(source);
  }
};
