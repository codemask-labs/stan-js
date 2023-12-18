import { createStore } from '../../../dist'

const { useStore } = createStore({
    count: 0,
})

export const App = () => {
    const { state: { count }, actions: { setCount } } = useStore('count')

    return (
        <button onClick={() => setCount(count + 1)}>
            count is {count}
        </button>
    )
}