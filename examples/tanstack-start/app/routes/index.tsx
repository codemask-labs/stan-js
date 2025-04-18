import { createFileRoute } from '@tanstack/react-router'
import { Counter } from '../components/Counter'
import { useStore } from '../store'

const Home = () => {
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

export const Route = createFileRoute('/')({
    component: Home,
})
