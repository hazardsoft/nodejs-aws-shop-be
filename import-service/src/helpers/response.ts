import type { APIGatewayProxyResult } from 'aws-lambda'

type Headers = Record<string, string>
const corsHeaders: Headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const createResponse = (
  payload: Pick<APIGatewayProxyResult, 'statusCode' | 'body'>
): APIGatewayProxyResult => {
  return {
    ...payload,
    headers: corsHeaders
  }
}

export { createResponse, corsHeaders }
