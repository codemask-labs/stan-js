import { useStore } from '../store'

export const ReactCounter = () => {
    const { state, actions } = useStore()

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
                {state.counter}
            </p>
            <div>
                <button onClick={() => actions.setCounter(prev => prev - 1)}>
                    -
                </button>
                <button onClick={() => actions.setCounter(prev => prev + 1)}>
                    +
                </button>
            </div>
        </section>
    )
}
