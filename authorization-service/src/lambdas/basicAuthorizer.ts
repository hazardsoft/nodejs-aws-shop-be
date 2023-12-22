import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";

const userName = process.env.USERNAME ?? "";
const userPassword = process.env.USERPASS ?? "";

const defaultAuthoriserResult: APIGatewayAuthorizerResult = {
  principalId: "user",
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: "Deny",
        Resource: "*",
      },
    ],
  },
};

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  try {
    console.log(`basic authorizer, event: ${JSON.stringify(event)}`);

    const authToken = event.authorizationToken.replace("Basic ", "");
    const buf = Buffer.from(authToken, "base64");
    const [uName, uPass] = buf.toString("utf-8").split(":");

    const isAuthenticated = userName === uName && userPassword === uPass;
    const effect = isAuthenticated ? "Allow" : "Deny";

    const authorizerResult: APIGatewayAuthorizerResult = {
      principalId: userName,
      policyDocument: {
        Version: defaultAuthoriserResult.policyDocument.Version,
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: event.methodArn,
          },
        ],
      },
    };

    console.log(
      `generated authorizer result: ${JSON.stringify(authorizerResult)}`,
    );
    return Promise.resolve(authorizerResult);
  } catch (error) {
    console.error(`error occurred in lambda authorizer!`);
    return Promise.resolve(defaultAuthoriserResult);
  }
};
