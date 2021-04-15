import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
export default {
  input: "src/main.js",
  output: { file: "dist/bundle.js" },
  plugins: [nodeResolve(), babel({ babelHelpers: "bundled" })],
};
