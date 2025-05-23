import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { fetchUser } from '../data'
import globals from '../globals.css?url'
import { StoreProvider } from '../store'

const RootComponent = () => {
    const { user } = Route.useLoaderData()
    const { counter } = Route.useSearch()

    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                <StoreProvider initialValue={{ user, counter }}>
                    <Outlet />
                </StoreProvider>
                <Scripts />
            </body>
        </html>
    )
}

const getUser = createServerFn({ method: 'GET' }).handler(fetchUser)

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'TanStack Start Starter',
            },
        ],
        links: [
            { rel: 'stylesheet', href: globals },
        ],
    }),
    component: RootComponent,
    loader: async () => {
        const user = await getUser()

        return {
            user,
        }
    },
    validateSearch: z.object({
        counter: z.number().optional(),
    }),
})
