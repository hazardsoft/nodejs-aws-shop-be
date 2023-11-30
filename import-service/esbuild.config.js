import * as esbuild from "esbuild";

const baseOptions = {
  format: "esm",
  bundle: true,
  treeShaking: true,
  sourcemap: false,
  platform: "node",
  minify: false,
};

const utilityOptions = {
  ...baseOptions,
  packages: "external",
};

const lambdaOptions = {
  ...baseOptions,
  external: ["@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner"],
};

await esbuild.build({
  entryPoints: ["src/lambdas/importProductsFile.ts"],
  outfile: "dist/lambdas/importProductsFile/importProductsFile.mjs",
  tsconfig: "tsconfig.json",
  ...lambdaOptions,
});

await esbuild.build({
  entryPoints: ["cdk/index.ts"],
  outfile: "cdk.out/index.js",
  tsconfig: "tsconfig.cdk.json",
  ...utilityOptions,
});
