import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthorizerHandlers } from "./handlers";
import "dotenv/config";

const userName = process.env.USERNAME ?? "";
const userPass = process.env.USERPASS ?? "";

class AuthorizerService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AuthorizerHandlers(this, "AuthorizerHandlers", {
      user: {
        name: userName,
        password: userPass,
      },
    });
  }
}

const app = new App();
const authService = new AuthorizerService(app, "AuthorizerService");

export { authService };
