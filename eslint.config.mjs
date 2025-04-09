import { codemaskConfig } from 'eslint-config-codemask'

export default [
    ...codemaskConfig,
    {
        rules: {
            'functional/immutable-data': 'off',
            '@typescript-eslint/ban-types': 'off',
            'no-shadow': 'off',
            'functional/functional-parameters': 'off',
            'functional/no-let': 'off',
            'react/no-children-prop': 'off',
            'react/hook-use-state': 'off',
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
        },
    },
    {
        ignores: ['src/**/*.test.{ts,tsx}'],
    },
]
