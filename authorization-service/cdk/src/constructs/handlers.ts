import { CfnOutput } from 'aws-cdk-lib'
import { Code, Function as LambdaFunction, Runtime, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface AuthorizationHandlersProps {
  username: string
  password: string
}
export class AuthorizationHandlers extends Construct {
  public readonly authorizer: IFunction

  constructor(scope: Construct, id: string, props: AuthorizationHandlersProps) {
    super(scope, id)

    this.authorizer = new LambdaFunction(this, 'BasicAuthorizer', {
      code: Code.fromAsset('../dist/handlers/basicAuthorizer'),
      handler: 'basicAuthorizer.handler',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        USERNAME: props.username,
        PASSWORD: props.password
      }
    })

    new CfnOutput(this, 'AuthorizerArn', {
      description: 'Lambda authorizer (uses Basic token bearer)',
      value: this.authorizer.functionArn,
      exportName: 'AuthorizerArn'
    })
  }
}
