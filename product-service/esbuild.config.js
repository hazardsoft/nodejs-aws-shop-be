import * as esbuild from 'esbuild'

const options = {
  format: 'esm',
  bundle: true,
  platform: 'node',
  packages: 'external',
  sourcemap: false,
  minify: false
}

await esbuild.build({
  entryPoints: ['cdk/index.ts'],
  outdir: 'cdk.out',
  ...options
})
await esbuild.build({
  entryPoints: ['src/lambdas/getProductsList.ts'],
  outfile: 'dist/lambdas/getProductsList/getProductsList.mjs',
  ...options
})
await esbuild.build({
  entryPoints: ['src/lambdas/getProductsById.ts'],
  outfile: 'dist/lambdas/getProductsById/getProductsById.mjs',
  ...options
})
