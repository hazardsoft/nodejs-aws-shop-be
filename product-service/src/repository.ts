import data from "./products.json";
import { Product } from "./types";
const products = data.products;

const findAll = async (): Promise<Product[]> => {
    return products;
}

const findOne = async (id: string): Promise<Product | undefined> => {
    return products.find(p => p.id === id);
}

export {findAll, findOne}