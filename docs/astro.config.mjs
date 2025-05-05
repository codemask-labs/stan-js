import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
    site: 'https://codemask-labs.github.io',
    base: import.meta.env.DEV ? '/' : '/stan-js/',
    integrations: [
        starlight({
            title: 'stan-js',
            logo: {
                src: './src/assets/logo.svg',
            },
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/codemask-labs/stan-js',
                },
            ],
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
                    label: 'Other',
                    autogenerate: { directory: 'other' },
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
