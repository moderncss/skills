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
};
