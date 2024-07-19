import * as esbuild from 'esbuild'

const options = {
  format: 'esm',
  bundle: true,
  platform: 'node',

  sourcemap: false,
  minify: false,
  tsconfig: 'tsconfig.app.json',
  packages: 'external'
}

await esbuild.build({
  entryPoints: ['src/handlers/basicAuthorizer.ts'],
  outfile: 'dist/handlers/basicAuthorizer/basicAuthorizer.mjs',
  ...options
})
