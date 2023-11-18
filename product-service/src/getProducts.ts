import { findAll } from "./repository";
import { ProductApiResponse, ProductApiSuccessfulResponse } from "./types";

export const handler = async (): Promise<ProductApiResponse> => {
    console.log(`lambda: getProducts`);
    const products = await findAll();
    return {
        statusCode: 200,
        body: JSON.stringify(<ProductApiSuccessfulResponse>{
            data: products
        })
    }
}