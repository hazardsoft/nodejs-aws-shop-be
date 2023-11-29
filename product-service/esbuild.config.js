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
  external: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],
};

await esbuild.build({
  entryPoints: ["src/lambdas/getProducts.ts"],
  outfile: "dist/lambdas/getProducts/getProducts.mjs",
  tsconfig: "tsconfig.json",
  ...lambdaOptions,
});

await esbuild.build({
  entryPoints: ["src/lambdas/getOneProduct.ts"],
  outfile: "dist/lambdas/getOneProduct/getOneProduct.mjs",
  tsconfig: "tsconfig.json",
  ...lambdaOptions,
});

await esbuild.build({
  entryPoints: ["src/lambdas/createProduct.ts"],
  outfile: "dist/lambdas/createProduct/createProduct.mjs",
  tsconfig: "tsconfig.json",
  ...lambdaOptions,
});

await esbuild.build({
  entryPoints: ["cdk/index.ts"],
  outfile: "cdk.out/index.js",
  tsconfig: "tsconfig.cdk.json",
  ...utilityOptions,
});

await esbuild.build({
  entryPoints: ["lib/db/setup.ts"],
  outfile: "dist/remote-db-setup.js",
  tsconfig: "tsconfig.json",
  ...utilityOptions,
});
