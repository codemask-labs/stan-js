import Bun, { $ } from 'bun'

await $`rm -rf dist`
await Bun.build({
    entrypoints: ['./src/index.ts', './src/mmkv/index.ts', './src/storage/index.ts'],
    outdir: 'dist',
    external: ['react-native-mmkv', 'react'],
    minify: true,
})
