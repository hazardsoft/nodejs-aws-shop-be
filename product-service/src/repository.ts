import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  AvailableProduct,
  DBQueryOutput,
  DBScanOutput,
  Product,
  ProductInput,
  Stock,
} from "./types";
import { ProductNotFoundError, RepositoryError } from "./errors";
import { v4 as uuidv4 } from "uuid";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient();
const dbDocClient = DynamoDBDocumentClient.from(dbClient);
const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? "";
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? "";

export const getAllProducts = async (): Promise<AvailableProduct[]> => {
  try {
    const [{ Items: productItems }, { Items: stockItems }] = await Promise.all([
      (await dbDocClient.send(
        new ScanCommand({
          TableName: productsTableName,
        }),
      )) as DBScanOutput<Product>,
      (await dbDocClient.send(
        new ScanCommand({
          TableName: stocksTableName,
        }),
      )) as DBScanOutput<Stock>,
    ]);

    const products = productItems ?? [];
    const stocks = stockItems ?? [];

    const availableProducts: AvailableProduct[] = products.map((p) => {
      const stock = stocks.find((s) => s.product_id === p.id);
      return {
        ...p,
        count: stock?.count || 0,
      };
    });

    return availableProducts;
  } catch (e) {
    throw new RepositoryError();
  }
};

export const getOneProduct = async (id: string): Promise<AvailableProduct> => {
  const { Items: products } = (await dbDocClient.send(
    new QueryCommand({
      TableName: productsTableName,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    }),
  )) as DBQueryOutput<Product>;

  if (!products || !products.length) {
    throw new ProductNotFoundError();
  }
  const product: Product = products[0];

  const { Items: stocks } = (await dbDocClient.send(
    new QueryCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues: { ":product_id": id },
    }),
  )) as DBQueryOutput<Stock>;
  const stock = stocks?.find((s) => s.product_id === id);

  const availableProduct: AvailableProduct = {
    ...product,
    count: stock?.count || 0,
  };
  return availableProduct;
};

export const createOneProduct = async (
  product: ProductInput,
): Promise<AvailableProduct> => {
  const newProductId: string = uuidv4();

  await dbDocClient.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: productsTableName,
            Item: {
              ...product,
              id: newProductId,
            },
          },
        },
        {
          Put: {
            TableName: stocksTableName,
            Item: {
              product_id: newProductId,
              count: product.count,
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
