import * as tailwindPlugin from 'prettier-plugin-tailwindcss';

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  trailingComma: 'all',
  singleQuote: true,
  plugins: [tailwindPlugin],
};

export default config;
