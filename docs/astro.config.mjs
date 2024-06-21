import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
    integrations: [
        starlight({
            title: 'stan-js',
            logo: {
                src: './src/assets/logo.svg',
            },
            social: {
                github: 'https://github.com/codemask-labs/stan-js',
            },
            sidebar: [
                {
                    label: 'Guides',
                    autogenerate: { directory: 'guides' },
                },
                {
                    label: 'Reference',
                    autogenerate: { directory: 'reference' },
                },
                {
                    label: 'Examples',
                    autogenerate: { directory: 'examples' },
                },
                {
                    label: 'Codemask',
                    link: 'https://codemask.com',
                },
            ],
            customCss: ['./src/styles.css'],
        }),
    ],
})
