import { describe, expect, test } from "vitest";
import { handler as getAllProducts } from "../src/getProducts.js";
import { handler as getOneProduct } from "../src/getOneProduct.js";
import {Product, ProductApiFailedResponse} from "../src/types.js"
import { APIGatewayProxyEvent } from "aws-lambda";

describe("Unit tests for Lambdas", () => {
    test("Get all products", async () => {
        const productsResponse = await getAllProducts();
        const products: Product[] = JSON.parse(productsResponse.body);

        expect(productsResponse.statusCode).toBe(200);
        expect(products.length).toBeGreaterThan(1)
    })

    test("Get one product (200)", async () => {
        const validProductId = "1"
        const productsResponse = await getOneProduct({
            pathParameters: {
                id: validProductId
            }
        });
        const product: Product = JSON.parse(productsResponse.body);

        expect(productsResponse.statusCode).toBe(200);
        expect(product).toMatchObject(<Product>{
            id: validProductId,
            title: "product #1",
            description: "product desc #1",
            price: 1
        })
    })

    test("Get one product (401)", async () => {
        const invalidProductId = ""
        const productsResponse = await getOneProduct({
            pathParameters: {
                id: invalidProductId
            }
        });
        const product: Product = JSON.parse(productsResponse.body);

        expect(productsResponse.statusCode).toBe(401);
        expect(product).toMatchObject(<ProductApiFailedResponse>{
            errorCode: 401, 
            message: "Product id is not defined"
        })
    })

    test("Get one product (404)", async () => {
        const invalidProductId = "10"
        const productsResponse = await getOneProduct({
            pathParameters: {
                id: invalidProductId
            }
        });
        const product: Product = JSON.parse(productsResponse.body);

        expect(productsResponse.statusCode).toBe(404);
        expect(product).toMatchObject(<ProductApiFailedResponse>{
            errorCode: 404, 
            message: "Product Not Found"
        })
    })
})