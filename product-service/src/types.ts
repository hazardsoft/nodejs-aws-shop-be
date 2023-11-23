export type Product = {
    id: string;
    title: string;
    description: string;
    price:number
}

type ProductInputErrorMessage = "Product id is not defined";
type ProductErrorMessage = "Product Not Found";

export type ProductApiFailedResponse = {
    errorCode: number;
    message: ProductInputErrorMessage | ProductErrorMessage
}