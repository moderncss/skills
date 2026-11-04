/** @type {import("stylelint").Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-modern",
    "stylelint-config-alphabetical-order",
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
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
    "declaration-property-custom-property-allowed-list": {
      "font-size": ["/^--font-size/"],
      "/^((scroll-)?(margin|padding)|gap|inset|border.*radius|(max-|min-)?(block|inline)-size)/": [
        "/^--length/",
        "/^--(info-popover|code-comparison)-/",
      ],
      "/^(border(?!.*radius)|outline|text-decoration-thickness)/": [
        "/^--line-length/",
        "/^--color-/",
      ],
      "/^(transition|animation)/": ["/^--duration/", "/^--timing-function/"],
      "box-shadow": ["/^--shadow/", "/^--line-length/", "/^--color-/"],
    },
    "value-type-custom-property-required-list": [
      ["color", "length", "time", "easing-function"],
      {
        ignoreValues: [
          "transparent",
          "currentcolor",
          "0",
          "/^-?[0-9.]+(em|ex|cap|ch|ic|lh|vb|vi)$/",
        ],
        ignoreProperties: { length: ["/^(max-|min-)?(block|inline)-size$/", "transform"] },
      },
    ],
  },
};
