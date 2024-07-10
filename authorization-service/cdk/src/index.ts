import { App } from 'aws-cdk-lib'
import { AuthorizationService } from './stack'

export const authorizationService = new AuthorizationService(new App(), 'AuthorizationService')
