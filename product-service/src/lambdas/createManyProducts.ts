import { SQSEvent } from "aws-lambda";
import { AvailableProduct } from "../types";
import { createManyProducts } from "../repository";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(`handling ${event.Records.length} messages from products queue`);

  try {
    const products: AvailableProduct[] = [];

    for (const record of event.Records) {
      console.log(
        `handling message: id ${record.messageId}, payload ${record.body}`,
      );
      const payload = <unknown>JSON.parse(record.body);
      if (Array.isArray(payload)) {
        products.push(...(<AvailableProduct[]>payload));
      } else {
        products.push(<AvailableProduct>payload);
      }
    }
    await createManyProducts(products);
  } catch (e) {
    console.error(JSON.stringify(e));
  }
};
