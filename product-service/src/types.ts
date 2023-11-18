export type Product = {
    id: string;
    title: string;
    description: string;
    price:number
}

export interface APIGatewayEvent {
    pathParameters: {
        id:string
    }
}

type ProductInputErrorMessage = "Product id is not defined";
type ProductErrorMessage = "Product Not Found";

export type ProductApiFailedResponse = {
    errorCode: number;
    message: ProductInputErrorMessage | ProductErrorMessage
}