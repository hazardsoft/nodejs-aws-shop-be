import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import {
  AvailableProduct,
  DBQueryOutput,
  DBScanOutput,
  Product,
  ProductInput,
  Stock,
} from "./types";
import { ProductNotFoundError } from "./errors";
import { randomUUID } from "node:crypto";

const dbClient = new DynamoDBClient();
const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? "";
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? "";

export const getAllProducts = async (): Promise<AvailableProduct[]> => {
  const { Items: productItems } = (await dbClient.send(
    new ScanCommand({
      TableName: productsTableName,
    }),
  )) as DBScanOutput<Product>;

  const { Items: stockItems } = (await dbClient.send(
    new ScanCommand({
      TableName: stocksTableName,
    }),
  )) as DBQueryOutput<Stock>;

  const products = productItems ?? [];
  const stocks = stockItems ?? [];

  const availableProducts: AvailableProduct[] = products.map((p) => {
    const stock = stocks.find((s) => s.productId === p.id);
    return {
      ...p,
      count: stock?.count || 0,
    };
  });

  return availableProducts;
};

export const getOneProduct = async (id: string): Promise<AvailableProduct> => {
  const { Items: productItems } = (await dbClient.send(
    new QueryCommand({
      TableName: productsTableName,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": { S: id },
      },
    }),
  )) as DBQueryOutput<Product>;

  const product = productItems ? productItems[0] : null;
  if (!product) {
    throw new ProductNotFoundError();
  }

  const { Items: stockItems } = (await dbClient.send(
    new QueryCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: "productId = :productId",
      ExpressionAttributeValues: {
        ":productId": { S: id },
      },
    }),
  )) as DBQueryOutput<Stock>;

  const stock = stockItems?.find((s) => s.productId === id);
  const availableProduct: AvailableProduct = {
    ...product,
    count: stock?.count || 0,
  };
  return availableProduct;
};

export const createOneProduct = async (
  product: ProductInput,
): Promise<AvailableProduct> => {
  const newProductId: string = randomUUID();

  await dbClient.send(
    new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: productsTableName,
            Item: {
              id: { S: newProductId },
              title: { S: product.title },
              description: { S: product.description },
              price: { N: product.price.toString() },
            },
          },
        },
        {
          Put: {
            TableName: stocksTableName,
            Item: {
              product_id: { S: newProductId },
              count: {
                N: product.count.toString(),
              },
            },
          },
        },
      ],
    }),
  );

  return {
    id: newProductId,
    ...product,
  };
};
