import type { ProductResponse } from '@/types.js'
import type { APIGatewayProxyResult } from 'aws-lambda'

type Headers = Record<string, string>
const corsHeaders: Headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const createResponse = (payload: ProductResponse): APIGatewayProxyResult => {
  return {
    ...payload,
    headers: corsHeaders
  }
}

export { createResponse, corsHeaders }
