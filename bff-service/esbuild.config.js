import * as esbuild from 'esbuild'

const options = {
  format: 'esm',
  bundle: true,
  platform: 'node',

  sourcemap: true,
  minify: false,
  tsconfig: 'tsconfig.app.json',
  packages: 'external'
}

await esbuild.build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/index.js',
  ...options
})
