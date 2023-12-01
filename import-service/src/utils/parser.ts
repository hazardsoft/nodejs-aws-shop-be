import { CastingContext, parse } from "csv-parse";
import { Readable } from "node:stream";
import { Product } from "../types";
import { validateProduct } from "./validate";

export const readProducts = async (stream: Readable): Promise<Product[]> => {
  const parser = stream.pipe(
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

  const products = [];
  for await (const row of parser) {
    console.log(`parsing product from row ${JSON.stringify(row)}`);
    const productValidationResult = validateProduct(row);
    if (!productValidationResult.success) {
      console.error(
        `product validation failed: ${productValidationResult.issues.toString()}`,
      );
      continue;
    } else {
      products.push(productValidationResult.data);
    }
  }
  return products;
};
