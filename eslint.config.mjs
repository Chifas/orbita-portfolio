import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // El código WebGL (react-three-fiber) muta cámara/objetos en cada frame
    // dentro de useFrame, que NO es la fase de render de React. La regla de
    // pureza de react-hooks da falsos positivos aquí, así que la relajamos
    // solo en esta carpeta.
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
