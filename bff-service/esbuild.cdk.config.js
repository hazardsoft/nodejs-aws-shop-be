import * as esbuild from "esbuild";

export const baseOptions = {
  format: "esm",
  bundle: true,
  keepNames: true,
  // treeShaking: true,
  sourcemap: false,
  platform: "node",
  minify: false,
  packages: "external",
};

await esbuild.build({
  entryPoints: ["cdk/index.ts"],
  outfile: "cdk.out/index.js",
  tsconfig: "tsconfig.cdk.json",
  ...baseOptions,
});
