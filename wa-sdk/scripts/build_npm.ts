// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/main.ts"],
  outDir: "./npm",
  compilerOptions: {
    lib: [
      "ESNext",
      "DOM",
    ]
  },
  shims: {
    deno: false,
  },
  package: {
    name: "wa-sdk",
    version: Deno.args[0],
    description: "WebAnalytics browser and server SDK",
    license: "MIT",
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("sw.js", "npm/sw.js");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
