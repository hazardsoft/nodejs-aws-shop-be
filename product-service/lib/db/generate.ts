import { v4 as uuidv4 } from "uuid";
import { Product, Stock } from "../../src/types";

const generatedItemsNum = 5;

export const createProducts = (): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= generatedItemsNum; i++) {
    products.push({
      id: uuidv4(),
      title: `Product ${i}`,
      description: `Description ${i}`,
      price: i,
    });
  }
  return products;
};

export const createStocks = (products: Product[]): Stock[] => {
  const stocks: Stock[] = [];
  products.forEach((product) => {
    stocks.push({
      product_id: product.id,
      count: Math.ceil(Math.random() * products.length),
    });
  });
  return stocks;
};
