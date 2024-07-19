import { Duration } from 'aws-cdk-lib'
import { IdentitySource, RequestAuthorizer, type IAuthorizer } from 'aws-cdk-lib/aws-apigateway'
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface ImportServiceAuthorizerProps {
  handlers: {
    authorizer: IFunction
  }
}

export class ImportServiceAuthorizer extends Construct {
  public readonly authorizer: IAuthorizer

  constructor(scope: Construct, id: string, props: ImportServiceAuthorizerProps) {
    super(scope, id)

    const role = new Role(this, 'ImportServiceAuthorizerRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com')
    })

    this.authorizer = new RequestAuthorizer(this, 'ImportServiceAuthorizer', {
      handler: props.handlers.authorizer,
      identitySources: [IdentitySource.header('Authorization')],
      assumeRole: role,
      resultsCacheTtl: Duration.seconds(0)
    })
  }
}
