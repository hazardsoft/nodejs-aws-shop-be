import { SQSEvent } from "aws-lambda";
import { AvailableProduct } from "../types";
import { createManyProducts } from "../repository";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(`handling ${event.Records.length} messages from products queue`);

  try {
    for await (const record of event.Records) {
      const products = <AvailableProduct[]>JSON.parse(record.body);

      console.log(
        `handling message: id ${record.messageId}, payload ${JSON.stringify(
          products,
        )}`,
      );
      await createManyProducts(products);
    }
  } catch (e) {
    console.error(JSON.stringify(e));
  }
};
