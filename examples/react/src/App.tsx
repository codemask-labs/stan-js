import { Fragment, useState } from 'react'
import { useStore } from './store'

const Todos = () => {
    const [todo, setTodo] = useState('')
    const { state: { todos }, actions: { setTodos } } = useStore('todos')

    return (
        <div>
            <h1>
                Todos
            </h1>
            {todos.map((todo, index) => (
                <Fragment key={`${todo}-${index}`}>
                    <div>
                        {todo}&nbsp;
                        <button onClick={() => setTodos(prev => prev.filter((_, todoIndex) => todoIndex !== index))}>
                            X
                        </button>
                    </div>
                    <br/>
                </Fragment>
            ))}
            <br/>
            <input value={todo} onChange={event => setTodo(event.target.value)} />
            <br/>
            <br/>
            <button onClick={() => {
                if (!todo) {
                    return
                }
                
                setTodos(prev => [...prev, todo])
                setTodo('')
            }}>
                Add todo
            </button>
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