import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getDbClientConfig } from "./config";

const config = getDbClientConfig();
const dbClient = new DynamoDBClient(config);
export default DynamoDBDocumentClient.from(dbClient);
