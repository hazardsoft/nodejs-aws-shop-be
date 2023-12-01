import { S3Event } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { CastingContext, parse } from "csv-parse";

const targetBucketName = process.env.BUCKET_NAME ?? "";

export const handler = async (event: S3Event): Promise<void> => {
  console.log(`lambda: products file parser, event: ${JSON.stringify(event)}`);

  for await (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const key = record.s3.object.key;
    console.log(`bucketName: ${bucketName}, key: ${key}`);

    if (targetBucketName !== bucketName) {
      console.log(
        `bucketName: ${bucketName} is not equal to targetBucketName: ${targetBucketName}`,
      );
    }

    const s3Client = new S3Client();
    const getObjectResult = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `${key}`,
      }),
    );
    if (!getObjectResult.Body) {
      console.log("Body is empty");
      return;
    }
    if (getObjectResult.Body instanceof Readable) {
      const parser = getObjectResult.Body.pipe(
        parse({
          columns: true,
          cast: (value: string, context: CastingContext) => {
            if (context.header) return value;
            switch (context.column) {
              case "price":
                return parseFloat(value);
              case "count":
                return parseInt(value);
            }
            return value;
          },
        }),
      );
      for await (const row of parser) {
        console.log(`reading product: ${JSON.stringify(row)}`);
      }
    }
  }
};
