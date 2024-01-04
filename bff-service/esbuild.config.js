import * as esbuild from "esbuild";

const isProduction = process.env.NODE_ENV === "production";

const baseOptions = {
  format: "esm",
  bundle: true,
  treeShaking: true,
  sourcemap: !isProduction,
  platform: "node",
  minify: isProduction,
  packages: "external",
};

await esbuild.build({
  entryPoints: ["src/main.ts"],
  outfile: "dist/main.mjs",
  tsconfig: "tsconfig.json",
  ...baseOptions,
});
