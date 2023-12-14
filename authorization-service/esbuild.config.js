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
  packages: "external",
};

await esbuild.build({
  entryPoints: ["src/lambdas/basicAuthorizer.ts"],
  outfile: "dist/lambdas/basicAuthorizer/basicAuthorizer.mjs",
  tsconfig: "tsconfig.json",
  ...lambdaOptions,
});

await esbuild.build({
  entryPoints: ["cdk/index.ts"],
  outfile: "cdk.out/index.js",
  tsconfig: "tsconfig.cdk.json",
  ...utilityOptions,
});
