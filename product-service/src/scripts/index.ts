import { main as listTables } from './list-tables.js'
import { createProductsTable, createStocksTable } from './create-tables.js'
import { main as describeTable } from './describe-tables.js'
import { populateProducts, populateStocks } from './populate-tables.js'
import data from '../data/products.json'
import type { Stock } from '@/types.js'

// Get list of tables
const tables = await listTables()
console.log('tables: ', tables)

// Create 'Products' table if it does not exist
const productsTable = tables?.find((t) => t === 'Products')
if (!productsTable) await createProductsTable()

// Create 'Stocks' table if it does not exist
const stocksTable = tables?.find((t) => t === 'Stocks')
if (!stocksTable) await createStocksTable()

// Check if there are items in 'Products' table
const productsCount = await describeTable('Products')
if (!productsCount) await populateProducts(data.products)

// Check if there are items in 'Stocks' table
const stocksCount = await describeTable('Stocks')
if (!stocksCount)
  await populateStocks(
    data.products.map((product) => ({ product_id: product.id, count: product.count }) as Stock)
  )
