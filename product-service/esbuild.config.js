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
  entryPoints: ['src/handlers/getProductsList.ts'],
  outfile: 'dist/handlers/getProductsList/getProductsList.mjs',
  ...options
})
await esbuild.build({
  entryPoints: ['src/handlers/getProductsById.ts'],
  outfile: 'dist/handlers/getProductsById/getProductsById.mjs',
  ...options
})
await esbuild.build({
  entryPoints: ['src/scripts/index.ts'],
  outfile: 'dist/scripts/index.mjs',
  ...options
})