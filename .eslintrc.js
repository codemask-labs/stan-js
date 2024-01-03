module.exports = {
    extends: ['codemask'],
    rules: {
        '@typescript-eslint/ban-types': 'off',
        'no-any': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'functional/no-let': 'off',
        'functional/immutable-data': 'off',
        'comma-dangle': ['error', 'always-multiline'],
    },
}
