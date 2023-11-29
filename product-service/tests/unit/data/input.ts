import { ProductInput, ProductValidationErrors } from "../../../src/types";

const validProduct: ProductInput = {
  title: "title",
  description: "description",
  price: 100,
  count: 0,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { title, ...noTitle } = validProduct;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { description, ...noDescription } = validProduct;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { price, ...noPrice } = validProduct;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { count, ...noCount } = validProduct;

export const invalidProductsTestInput: {
  product: unknown;
  reason: ProductValidationErrors;
}[] = [
  {
    product: noTitle,
    reason: ProductValidationErrors.TITLE_REQUIRED,
  },
  {
    product: noDescription,
    reason: ProductValidationErrors.DESCRIPTION_REQUIRED,
  },
  {
    product: noPrice,
    reason: ProductValidationErrors.PRICE_REQUIRED,
  },
  {
    product: noCount,
    reason: ProductValidationErrors.COUNT_REQUIRED,
  },
  {
    product: { ...validProduct, title: "" },
    reason: ProductValidationErrors.TITLE_TOO_SHORT,
  },
  {
    product: { ...validProduct, title: 0 },
    reason: ProductValidationErrors.TITLE_MUST_BE_STRING,
  },
  {
    product: { ...validProduct, description: "" },
    reason: ProductValidationErrors.DESCRIPTION_TOO_SHORT,
  },
  {
    product: { ...validProduct, description: 0 },
    reason: ProductValidationErrors.DESCRIPTION_MUST_BE_STRING,
  },
  {
    product: { ...validProduct, price: 0 },
    reason: ProductValidationErrors.PRICE_TOO_LOW,
  },
  {
    product: { ...validProduct, price: "0" },
    reason: ProductValidationErrors.PRICE_MUST_BE_NUMBER,
  },
  {
    product: { ...validProduct, count: -1 },
    reason: ProductValidationErrors.COUNT_TOO_LOW,
  },
  {
    product: { ...validProduct, count: "-1" },
    reason: ProductValidationErrors.COUNT_MUST_BE_NUMBER,
  },
];
