import { Fragment, useState } from 'react'
import { reset, useStore } from './store'

const Todos = () => {
    const [todo, setTodo] = useState('')
    const { state: { todos }, actions: { setTodos } } = useStore('todos')

    return (
        <div>
            <h1>
                Todos
            </h1>
            <button onClick={() => reset('todos')}>
                Reset todos
            </button>
            <br />
            <br />
            {todos.map((todo, index) => (
                <Fragment key={`${todo}-${index}`}>
                    <div>
                        {todo}&nbsp;
                        <button onClick={() => setTodos(prev => prev.filter((_, todoIndex) => todoIndex !== index))}>
                            X
                        </button>
                    </div>
                    <br />
                </Fragment>
            ))}
            <br />
            <form
                onSubmit={event => {
                    event.preventDefault()

                    if (!todo) {
                        return
                    }
                    setTodos(prev => [...prev, todo])
                    setTodo('')
                }}
            >
                <input value={todo} onChange={event => setTodo(event.target.value)} />
                <br />
                <br />
                <button type="submit">
                    Add todo
                </button>
            </form>
        </div>
    )
}

export const App = () => {
    const { state: { counter, user }, actions: { setCounter } } = useStore('counter', 'user')

    return (
        <>
            <h1>
                Hi {user}
            </h1>
            <button onClick={() => setCounter(prev => prev + 1)}>
                count is {counter}
            </button>
            <hr />
            <Todos />
        </>
    )
}
