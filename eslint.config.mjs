import codemaskConfig from 'eslint-config-codemask'

/**
 * @type {Array<import('eslint').Linter.FlatConfig>}
 */
export default [
    ...codemaskConfig,
    {
        rules: {
            '@typescript-eslint/comma-dangle': 'off',
            'functional/immutable-data': 'off',
            '@typescript-eslint/ban-types': 'off',
            'no-shadow': 'off',
            'functional/functional-parameters': 'off',
            'import/order': 'off',
            'functional/no-let': 'off',
            'react/no-children-prop': 'off',
            'react/hook-use-state': 'off',
        },
    },
    {
        ignores: ['src/**/*.test.{ts,tsx}'],
    },
]
