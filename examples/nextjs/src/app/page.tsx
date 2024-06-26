'use client'

import { Counter } from '@/Counter'
import { useScopedStore } from '@/store'

const HomePage = () => {
    const { user } = useScopedStore().useStore()

    return (
        <main className="flex flex-col gap-10 items-center">
            <h1 className="text-4xl">
                Hello {user}!
            </h1>
            <Counter />
        </main>
    )
}

export default HomePage
