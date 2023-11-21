import {
  PutItemCommandOutput,
  QueryCommandOutput,
  ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Stock = {
  productId: string;
  count: number;
};

export type AvailableProduct = Product & Pick<Stock, "count">;
export type ProductInput = Omit<AvailableProduct, "id">;

export type DBScanOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T[];
};
export type DBQueryOutput<T> = Omit<QueryCommandOutput, "Items"> & {
  Items?: T[];
};
export type DBPutOutput<T> = Omit<PutItemCommandOutput, "Attributes"> & {
  Attributes?: T;
};

type ProductInputErrorMessage = "Product id is not defined";
type ProductErrorMessage = "Product Not Found";
type ProductCreateErrorMessage = "Product payload is absent or incorrect";
type InternalServerError = "Internal Server Error";

type ErrorMessage =
  | ProductInputErrorMessage
  | ProductErrorMessage
  | ProductCreateErrorMessage
  | InternalServerError;

export type ProductApiFailedResponse = {
  errorCode: number;
  message: ErrorMessage;
};
