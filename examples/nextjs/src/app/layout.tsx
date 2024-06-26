import { fetchUser, metadata } from '@/data'
import { StoreProvider } from '@/store'
import './globals.css'

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await fetchUser()

    return (
        <html lang="en">
            <body>
                <StoreProvider initialValue={{ user }}>
                    {children}
                </StoreProvider>
            </body>
        </html>
    )
}

export default RootLayout
export { metadata }
