import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },
  {
    rules: {
      // Allow setState in useEffect when synchronizing with external systems like localStorage
      // This is a valid pattern for client-only apps that need to sync with browser APIs
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
