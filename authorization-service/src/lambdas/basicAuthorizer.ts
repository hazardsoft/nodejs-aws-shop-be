import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";

const userName = process.env.USERNAME ?? "";
const userPassword = process.env.USERPASS ?? "";

type PolicyDocument = {
  Version: "2012-10-17";
  Statement: [
    {
      Sid: "BasicAuthorizerPolicy";
      Effect: "Allow" | "Deny";
      Action: ["execute-api:Invoke"];
      Resource: string;
    },
  ];
};

export const handler = (
  event: APIGatewayTokenAuthorizerEvent,
): PolicyDocument => {
  console.log(`basic authorizer, event: ${JSON.stringify(event)}`);

  const buf = Buffer.from(event.authorizationToken, "base64");

  const authToken = buf.toString("utf8").replace("Basic ", "");
  console.log(`authToken: ${authToken}`);

  const [uName, uPass] = authToken.split(":");
  console.log(`uName: ${uName}, uPass: ${uPass}`);

  const isCorrectCredentials = userName === uName && userPassword === uPass;
  const policy: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "BasicAuthorizerPolicy",
        Effect: isCorrectCredentials ? "Allow" : "Deny",
        Action: ["execute-api:Invoke"],
        Resource: event.methodArn,
      },
    ],
  };
  console.log(`generated policy: ${JSON.stringify(policy)}`);
  return policy;
};
