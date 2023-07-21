import { DEFAULT_EXTENSIONS } from "@babel/core";
import babel from "@rollup/plugin-babel";

import typescriptEngine from "typescript";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      typescript({
        tsconfig: "./tsconfig.json",
        typescript: typescriptEngine,
        include: ["*.ts+(|x)", "**/*.ts+(|x)"],
        exclude: ["dist", "node_modules/**"],
      }),
      babel({
        extensions: [...DEFAULT_EXTENSIONS, ".ts", "tsx"],
        babelHelpers: "runtime",
        exclude: /node_modules/,
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
