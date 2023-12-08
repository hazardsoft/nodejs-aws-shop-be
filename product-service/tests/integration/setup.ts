import { beforeAll } from "vitest";
import { createProductsTable, createStocksTable } from "../../lib/db/tables.js";
import dbClient from "../../lib/db/client.js";
import { getTableNames } from "../../lib/db/config.js";
import { populateProducts, populateStocks } from "../../lib/db/populate.js";
import { createProducts, createStocks } from "../../lib/db/generate.js";

beforeAll(async () => {
  const [productsTableName, stocksTableName] = getTableNames();

  try {
    await createProductsTable(dbClient, productsTableName);
    await createStocksTable(dbClient, stocksTableName);
    console.log("Tables created");

    const products = createProducts();
    const stocks = createStocks(products);
    await populateProducts(dbClient, productsTableName, products);
    await populateStocks(dbClient, stocksTableName, stocks);
    console.log("Tables populated");
  } catch (e) {
    console.error(e);
  }
});
