import { Code, Function as LambdaFunction, Runtime, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class AuthorizationHandlers extends Construct {
  public readonly authorizer: IFunction
  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.authorizer = new LambdaFunction(this, 'BasicAuthorizer', {
      code: Code.fromAsset('../dist/handlers/basicAuthorizer'),
      handler: 'basicAuthorizer.handler',
      runtime: Runtime.NODEJS_20_X
    })
  }
}
