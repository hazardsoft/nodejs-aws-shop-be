import { type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { AttributeType, Billing, TableEncryptionV2, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib/core'
import { env } from '../config.js'

interface ProductServiceDBProps {
  handlers: {
    getOneProduct: IFunction
    getManyProducts: IFunction
    createOneProduct: IFunction
  }
}

export class ProductServiceDB extends Construct {
  public readonly products: TableV2
  public readonly stocks: TableV2

  constructor(scope: Construct, id: string, props: ProductServiceDBProps) {
    super(scope, id)

    // Products table
    this.products = new TableV2(this, 'Products', {
      tableName: env.PRODUCTS_TABLE_NAME,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.dynamoOwnedKey(),
      removalPolicy: RemovalPolicy.DESTROY
    })

    // Stocks table
    this.stocks = new TableV2(this, 'Stocks', {
      tableName: env.STOCKS_TABLE_NAME,
      partitionKey: { name: 'product_id', type: AttributeType.STRING },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.dynamoOwnedKey(),
      removalPolicy: RemovalPolicy.DESTROY
    })

    // granular permission to create a product
    this.products.grant(props.handlers.createOneProduct, 'dynamodb:PutItem')
    this.stocks.grant(props.handlers.createOneProduct, 'dynamodb:PutItem')

    // granular permission to get all products
    this.products.grant(props.handlers.getManyProducts, 'dynamodb:Scan')
    this.stocks.grant(props.handlers.getManyProducts, 'dynamodb:BatchGetItem')

    // granular permission to get a product by id
    this.products.grant(props.handlers.getOneProduct, 'dynamodb:BatchGetItem')
    this.stocks.grant(props.handlers.getOneProduct, 'dynamodb:BatchGetItem')
  }
}
