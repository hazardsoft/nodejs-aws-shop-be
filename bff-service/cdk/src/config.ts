export const config = {
  account: {
    id: process.env.CDK_DEFAULT_ACCOUNT ?? '',
    region: process.env.CDK_DEFAULT_REGION ?? ''
  },
  servers: {
    bff: {
      url: process.env.BFF_SERVICE_URL ?? ''
    }
  }
}
