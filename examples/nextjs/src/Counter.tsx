import { useScopedStore } from './store'

export const Counter = () => {
    const { counter, setCounter } = useScopedStore().useStore()

    return (
        <section>
            <button onClick={() => setCounter(prev => prev - 1)}>-</button>
            <span>{counter}</span>
            <button onClick={() => setCounter(prev => prev + 1)}>+</button>
        </section>
    )
}
