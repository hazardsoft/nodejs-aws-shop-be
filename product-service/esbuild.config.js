import * as esbuild from "esbuild";

const options = {
    format: "esm",
    bundle: true,
    packages: "external",
    sourcemap: true,
    minify: false,
}

await esbuild.build({
    entryPoints: ["src/lambdas/getProducts.ts"],
    outfile: "dist/lambdas/getProducts/getProducts.mjs",
    tsconfig: "tsconfig.json",
    ...options
})

await esbuild.build({
    entryPoints: ["src/lambdas/getOneProduct.ts"],
    outfile: "dist/lambdas/getOneProduct/getOneProduct.mjs",
    tsconfig: "tsconfig.json",
    ...options
})

await esbuild.build({
    entryPoints: ["cdk/index.ts"],
    outfile: "cdk.out/index.js",
    tsconfig: "tsconfig.cdk.json",
    ...options
})