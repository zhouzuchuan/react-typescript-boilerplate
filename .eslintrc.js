module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'react-app',
        'react-app/jest',
    ],

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        '@typescript-eslint/no-unused-expressions': ['off'],
        'import/no-anonymous-default-export': [
            1,
            {
                allowObject: true,
                allowArray: true,
                allowLiteral: true,
            },
        ],
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
}
