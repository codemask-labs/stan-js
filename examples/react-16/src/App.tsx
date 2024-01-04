import { useStore } from './store'

export const App = () => {
    const { state: { counter, persisted }, actions: { setCounter, setPersisted } } = useStore()

    return (
        <div>
            <button onClick={() => setCounter(count => count + 1)}>
                Count: {counter}
            </button>
            <button onClick={() => setPersisted(count => count + 1)}>
                Persisted: {persisted}
            </button>
        </div>
    )
}
