import { useScopedStore } from './store'

export const Counter = () => {
    const { counter, setCounter } = useScopedStore().useStore()

    return (
        <div className="flex gap-10 text-4xl items-center">
            <button onClick={() => setCounter(prev => prev - 1)}>-</button>
            <span>{counter}</span>
            <button onClick={() => setCounter(prev => prev + 1)}>+</button>
        </div>
    )
}
