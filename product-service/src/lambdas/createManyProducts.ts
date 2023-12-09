import { SQSEvent } from "aws-lambda";
import { ProductInput } from "../types";
import { createManyProducts } from "../repository";
import { publishProducts } from "../topic";

const topicArn = process.env.PRODUCTS_TOPIC_ARN ?? "";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(`handling x${event.Records.length} messages from products queue`);

  try {
    const products: ProductInput[] = [];

    for (const record of event.Records) {
      console.log(
        `handling message: id ${record.messageId}, payload\n${record.body}`,
      );
      const payload = <unknown>JSON.parse(record.body);
      if (Array.isArray(payload)) {
        products.push(...(<ProductInput[]>payload));
      } else {
        products.push(<ProductInput>payload);
      }
    }
    const createdProducts = await createManyProducts(products);
    await publishProducts(topicArn, createdProducts);
  } catch (e) {
    console.error(JSON.stringify(e));
  }
};
