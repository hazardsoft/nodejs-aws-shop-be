import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  AvailableProduct,
  DBQueryOutput,
  DBScanOutput,
  Product,
  ProductInput,
  ProductRecord,
  Stock,
  StockRecord,
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
  )) as DBScanOutput<ProductRecord>;

  const { Items: stockItems } = (await dbClient.send(
    new ScanCommand({
      TableName: stocksTableName,
    }),
  )) as DBScanOutput<StockRecord>;

  const products: Product[] =
    productItems?.map((p) => unmarshall(p) as Product) ?? [];
  const stocks: Stock[] = stockItems?.map((s) => unmarshall(s) as Stock) ?? [];

  const availableProducts: AvailableProduct[] = products.map((p) => {
    const stock = stocks.find((s) => s.product_id === p.id);
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
  )) as DBQueryOutput<ProductRecord>;

  if (!productItems || !productItems.length) {
    throw new ProductNotFoundError();
  }

  const product = unmarshall(productItems[0]) as Product;

  const { Items: stockItems } = (await dbClient.send(
    new QueryCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues: {
        ":product_id": { S: id },
      },
    }),
  )) as DBQueryOutput<StockRecord>;

  const stocks: Stock[] = stockItems?.map((s) => unmarshall(s) as Stock) ?? [];

  const stock = stocks.find((s) => s.product_id === id);
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
