/** @type {import("stylelint").Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-modern",
    "stylelint-config-alphabetical-order",
  ],
  overrides: [
    {
      files: ["**/*.js"],
      customSyntax: "postcss-lit",
    },
  ],
  referenceFiles: ["src/variables.css"],
  rules: {
    "no-unknown-custom-properties": true,
    "no-unknown-animations": true,
    "no-unknown-custom-media": true,
  },
};
