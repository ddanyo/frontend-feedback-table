module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended', // Включает плагин Prettier и отключает правила, конфликтующие с Prettier.
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'prettier'],
    rules: {
        'prettier/prettier': 'error', // Подсвечивает ошибки форматирования от Prettier как ошибки ESLint.
        'react/react-in-jsx-scope': 'off', // Не требуется в проектах на React 17+
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
