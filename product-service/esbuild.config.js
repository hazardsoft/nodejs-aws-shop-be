import * as esbuild from "esbuild";

const options = {
  format: "esm",
  bundle: true,
  packages: "external",
  sourcemap: false,
  minify: false,
};

await esbuild.build({
  entryPoints: ["src/lambdas/getProducts.ts"],
  outfile: "dist/lambdas/getProducts/getProducts.mjs",
  tsconfig: "tsconfig.json",
  ...options,
});

await esbuild.build({
  entryPoints: ["src/lambdas/getOneProduct.ts"],
  outfile: "dist/lambdas/getOneProduct/getOneProduct.mjs",
  tsconfig: "tsconfig.json",
  ...options,
});

await esbuild.build({
  entryPoints: ["src/lambdas/createProduct.ts"],
  outfile: "dist/lambdas/createProduct/createProduct.mjs",
  tsconfig: "tsconfig.json",
  ...options,
});

await esbuild.build({
  entryPoints: ["cdk/index.ts"],
  outfile: "cdk.out/index.js",
  tsconfig: "tsconfig.cdk.json",
  ...options,
});

await esbuild.build({
  entryPoints: ["src/data/populate.ts"],
  outfile: "dist/populate.js",
  tsconfig: "tsconfig.json",
  ...options,
});
