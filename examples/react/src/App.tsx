import React, { useEffect, useRef } from 'react'
import { AnimateRerender } from './AnimateRerender'
import { actions, fetchUsers, getState, reset, useCapsMessage, useStore } from './store'

const CurrentTime = () => {
    const { state } = useStore('currentTime')

    return (
        <AnimateRerender>
            <h1>
                {state.currentTime.toLocaleTimeString()}
            </h1>
            <p>
                The timer is updating every second using a setInterval.
            </p>
        </AnimateRerender>
    )
}

const Message = () => {
    const upperCaseMessage = useCapsMessage()

    return <AnimateRerender>Uppercased message: {upperCaseMessage}</AnimateRerender>
}

const MessageInput = () => {
    const { actions } = useStore('message')

    return (
        <AnimateRerender>
            <input
                type="text"
                defaultValue={getState().message}
                onChange={(e) => actions.setMessage(e.target.value)}
            />
            <p>
                Message is printed in uppercase using derived hook.<br />
                Updates are done using <span>actions</span> so Input component won't re-render!
            </p>
        </AnimateRerender>
    )
}

const Counter = () => {
    const { state, actions } = useStore('counter')

    return (
        <AnimateRerender>
            <h1>{state.counter}</h1>
            <div className="buttons-container">
                <button onClick={() => actions.setCounter(prev => prev - 1)}>Decrement</button>
                <button onClick={() => actions.setCounter(prev => prev + 1)}>Increment</button>
            </div>
            <button onClick={() => reset('counter')}>Reset counter</button>
            <p>
                Counter is incremented and decremented using <span>actions</span>,<br />and can be reset using <span>reset</span> function.
            </p>
        </AnimateRerender>
    )
}

const Table = () => {
    const { state, actions } = useStore('users')
    const listRef = useRef<HTMLDivElement>(null)

    const fetchMoreUsers = async () => {
        const users = await fetchUsers()

        actions.setUsers(prev => [...prev, ...users])
        setTimeout(() => {
            listRef.current?.scrollTo({
                top: listRef.current?.scrollHeight,
                left: 0,
                behavior: 'smooth',
            })
        }, 1)
    }

    return (
        <AnimateRerender>
            <div
                className="users"
                ref={listRef}
            >
                {state.users.map(user => (
                    <div key={user}>
                        {user}
                    </div>
                ))}
            </div>
            <button onClick={fetchMoreUsers}>
                Fetch more users
            </button>
            <p>
                Users are fetched from an API<br />and appended to the list asynchronously.
            </p>
        </AnimateRerender>
    )
}

export const App = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            actions.setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <React.Fragment>
            <CurrentTime />
            <hr />
            <Message />
            <MessageInput />
            <hr />
            <Counter />
            <hr />
            <Table />
        </React.Fragment>
    )
}
