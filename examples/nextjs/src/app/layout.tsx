import { StoreProvider } from '@/store'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Create Next App with stan-js',
    description: 'stan-js & next-js example app',
}

const fetchUser = async () => {
    try {
        const res = await fetch('https://randommer.io/Name', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: 'type=firstname&number=1',
            method: 'POST',
            cache: 'no-cache',
        })
        const [user] = await res.json()

        return user as string
    } catch {
        return undefined
    }
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await fetchUser()

    return (
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider initialValue={{ user }}>
                    {children}
                </StoreProvider>
            </body>
        </html>
    )
}

export default RootLayout
