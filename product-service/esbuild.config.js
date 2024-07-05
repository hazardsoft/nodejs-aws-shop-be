import * as esbuild from 'esbuild'

const options = {
  format: 'esm',
  bundle: true,
  platform: 'node',

  sourcemap: false,
  minify: false,
  tsconfig: 'tsconfig.app.json'
}

const lambdaOptions = {
  ...options,
  external: [
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/client-lambda',
    '@aws-sdk/lib-dynamodb',
    '@aws-sdk/client-sns'
  ]
}

const utilityOptions = {
  ...options,
  packages: 'external'
}

// Compile AWS CDK stack and utility scripts
await esbuild.build({
  entryPoints: ['cdk/index.ts'],
  outdir: 'cdk.out',
  ...utilityOptions
})
await esbuild.build({
  entryPoints: ['src/scripts/index.ts'],
  outfile: 'dist/scripts/index.mjs',
  ...utilityOptions
})

// Compile Lambda handlers
await esbuild.build({
  entryPoints: ['src/handlers/getProductsList.ts'],
  outfile: 'dist/handlers/getProductsList/getProductsList.mjs',
  ...lambdaOptions
})
await esbuild.build({
  entryPoints: ['src/handlers/getProductsById.ts'],
  outfile: 'dist/handlers/getProductsById/getProductsById.mjs',
  ...lambdaOptions
})
await esbuild.build({
  entryPoints: ['src/handlers/createProduct.ts'],
  outfile: 'dist/handlers/createProduct/createProduct.mjs',
  ...lambdaOptions
})
await esbuild.build({
  entryPoints: ['src/handlers/catalogBatchProcess.ts'],
  outfile: 'dist/handlers/catalogBatchProcess/catalogBatchProcess.mjs',
  ...lambdaOptions
})
