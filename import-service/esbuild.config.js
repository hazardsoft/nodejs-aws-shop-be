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
  external: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner']
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

// Compile Lambda handlers
await esbuild.build({
  entryPoints: ['src/handlers/importProductsFile.ts'],
  outfile: 'dist/handlers/importProductsFile/importProductsFile.mjs',
  ...lambdaOptions
})
