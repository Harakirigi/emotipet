module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["react", "@typescript-eslint", "import"],
    rules: {
        "import/namespace": "off", // Disable problematic namespace rule
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_" },
        ],
        "react/prop-types": "off", // Disable prop-types since we're using TypeScript
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
