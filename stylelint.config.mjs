/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-alphabetical-order"],
  overrides: [
    {
      files: ["**/*.js"],
      customSyntax: "postcss-lit",
    },
  ],
  rules: {
    "declaration-property-value-no-unknown": [
      true,
      {
        ignoreProperties: {
          "clip-path": /.*/,
          cursor: /.*/,
        },
      },
    ],
  },
};
