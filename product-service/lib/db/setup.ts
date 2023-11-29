import { Product, Stock } from "../../src/types";
import { createProducts, createStocks } from "./generate";
import { populateProducts, populateStocks } from "./populate";
import dbClient from "./client.js";
import { getTableNames } from "./config";

const products: Product[] = createProducts();
const stocks: Stock[] = createStocks(products);

const [productsTableName, stocksTableName] = getTableNames();
await populateProducts(dbClient, productsTableName, products);
await populateStocks(dbClient, stocksTableName, stocks);
