import { useStore } from '../store'

export const Counter = () => {
    const { counter, setCounter } = useStore()

    return (
        <section>
            <button onClick={() => setCounter(prev => prev - 1)}>-</button>
            <span>{counter}</span>
            <button onClick={() => setCounter(prev => prev + 1)}>+</button>
        </section>
    )
}
