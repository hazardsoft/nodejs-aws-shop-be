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
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import dbClient from "../lib/db/client";

const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? "";
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? "";

export const getAllProducts = async (): Promise<AvailableProduct[]> => {
  try {
    const [{ Items: productItems }, { Items: stockItems }] = await Promise.all([
      (await dbClient.send(
        new ScanCommand({
          TableName: productsTableName,
        }),
      )) as DBScanOutput<Product>,
      (await dbClient.send(
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
  const { Items: products } = (await dbClient.send(
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

  const { Items: stocks } = (await dbClient.send(
    new QueryCommand({
      TableName: stocksTableName,
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

type TransactionItems = NonNullable<TransactWriteCommandInput["TransactItems"]>;

export const createManyProducts = async (
  products: ProductInput[],
): Promise<AvailableProduct[]> => {
  try {
    const allTransactionItems = [];
    const allProducts: AvailableProduct[] = [];

    for (const product of products) {
      const [newProductId, transationItems] =
        createTransactionItemsForOneRecord(product);

      allTransactionItems.push(...transationItems);
      allProducts.push({
        id: newProductId,
        ...product,
      });
    }
    await dbClient.send(
      new TransactWriteCommand({ TransactItems: allTransactionItems }),
    );
    return allProducts;
  } catch (e) {
    throw new RepositoryError();
  }
};

export const createTransactionItemsForOneRecord = (
  product: ProductInput,
): [productId: string, transactionItems: TransactionItems] => {
  const newProductId: string = uuidv4();
  const { count, ...productNoCount } = product;

  const transactionItems: TransactionItems = [
    {
      Put: {
        TableName: productsTableName,
        Item: {
          ...productNoCount,
          id: newProductId,
        },
      },
    },
    {
      Put: {
        TableName: stocksTableName,
        Item: {
          product_id: newProductId,
          count,
        },
      },
    },
  ];
  return [newProductId, transactionItems];
};

export const createOneProduct = async (
  product: ProductInput,
): Promise<AvailableProduct> => {
  try {
    const [newProductId, transactionItems] =
      createTransactionItemsForOneRecord(product);

    await dbClient.send(
      new TransactWriteCommand({
        TransactItems: transactionItems,
      }),
    );

    return {
      id: newProductId,
      ...product,
    };
  } catch (e) {
    throw new RepositoryError();
  }
};
