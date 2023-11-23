import { describe, expect, test } from "vitest";
import { handler as getAllProducts } from "../src/lambdas/getProducts.js";
import { handler as getOneProduct } from "../src/lambdas/getOneProduct.js";
import {Product, ProductApiFailedResponse} from "../src/types.js"
import { HTTP_STATUS_CODES } from "../src/constants.js";

describe("Unit tests for Lambdas", () => {
    test("Get all products", async () => {
        const productsResponse = await getAllProducts();
        const products: Product[] = JSON.parse(productsResponse.body);

        expect(productsResponse.statusCode).toBe(HTTP_STATUS_CODES.OK);
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

        expect(productsResponse.statusCode).toBe(HTTP_STATUS_CODES.OK);
        expect(product).toMatchObject(<Product>{
            id: validProductId,
            title: "product #1",
            description: "product desc #1",
            price: 1
        })
    })

    test("Get one product (400)", async () => {
        const invalidProductId = ""
        const productsResponse = await getOneProduct({
            pathParameters: {
                id: invalidProductId
            }
        });
        const product: Product = JSON.parse(productsResponse.body);

        expect(productsResponse.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        expect(product).toMatchObject(<ProductApiFailedResponse>{
            errorCode: HTTP_STATUS_CODES.BAD_REQUEST, 
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

        expect(productsResponse.statusCode).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        expect(product).toMatchObject(<ProductApiFailedResponse>{
            errorCode: HTTP_STATUS_CODES.NOT_FOUND, 
            message: "Product Not Found"
        })
    })
})