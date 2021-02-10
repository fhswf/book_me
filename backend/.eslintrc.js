
module.exports = {
    root: true,
    env: {
        "browser": true,
        "es6": true,
        "node": true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    rules: {
        "arrow-parens": ["error", "as-needed"],
        "require-await": "off",
        "@typescript-eslint/require-await": "off"
    },
};