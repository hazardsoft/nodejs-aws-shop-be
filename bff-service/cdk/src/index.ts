import { App } from 'aws-cdk-lib'
import { BffService } from './stack'

export const bffService = new BffService(new App(), 'BffService')
