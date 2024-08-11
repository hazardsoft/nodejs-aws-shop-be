import * as esbuild from 'esbuild'

const options = {
  format: 'esm',
  bundle: true,
  platform: 'node',

  sourcemap: true,
  minify: false,
  tsconfig: 'tsconfig.cdk.json',
  packages: 'external'
}

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'cdk.out',
  ...options
})
