'use client'

import { Counter } from '@/Counter'
import { useStore } from '@/store'

const HomePage = () => {
    const { user } = useStore()

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
