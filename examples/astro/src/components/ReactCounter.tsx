import { useStore } from '../store'

export const ReactCounter = () => {
    const { counter, setCounter } = useStore()

    return (
        <section className="react">
            <img
                src="/react.svg"
                alt="React"
            />
            <h1>
                React Counter
            </h1>
            <p>
                {counter}
            </p>
            <div>
                <button onClick={() => setCounter(prev => prev - 1)}>
                    -
                </button>
                <button onClick={() => setCounter(prev => prev + 1)}>
                    +
                </button>
            </div>
        </section>
    )
}
