'use client'

import { Counter } from '@/Counter'
import { useScopedStore } from '@/store'

const HomePage = () => {
    const { user } = useScopedStore().useStore()

    return (
        <main>
            <h1>
                Hello {user}!
            </h1>
            <Counter />
        </main>
    )
}

export default HomePage
