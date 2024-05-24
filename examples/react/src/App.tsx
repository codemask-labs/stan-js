import React, { useEffect, useRef } from 'react'
import { AnimateRerender } from './AnimateRerender'
import { actions, fetchUsers, getState, reset, useStore } from './store'

const CurrentTime = () => {
    const { currentTime } = useStore()

    return (
        <AnimateRerender>
            <h1>
                {currentTime.toLocaleTimeString()}
            </h1>
        </AnimateRerender>
    )
}

const Message = () => {
    const { upperCaseMessage } = useStore()

    return <AnimateRerender>Uppercased message: {upperCaseMessage}</AnimateRerender>
}

const MessageInput = () => {
    const { setMessage } = useStore()

    return (
        <AnimateRerender>
            <input
                type="text"
                defaultValue={getState().message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <p>
                Message is printed in uppercase using derived hook.<br />
                Updates are done using <span>actions</span> so Input component won't re-render!
            </p>
        </AnimateRerender>
    )
}

const CounterDisplay = () => {
    const { counter } = useStore()

    return (
        <AnimateRerender>
            <h1>{counter}</h1>
        </AnimateRerender>
    )
}

const Counter = () => {
    const { setCounter } = useStore()

    return (
        <AnimateRerender>
            <CounterDisplay />
            <div className="buttons-container">
                <button onClick={() => setCounter(prev => prev - 1)}>Decrement</button>
                <button onClick={() => setCounter(prev => prev + 1)}>Increment</button>
            </div>
            <button onClick={() => reset('counter')}>Reset counter</button>
            <p>
                Counter is incremented and decremented using <span>actions</span>,<br />and can be reset using <span>reset</span> function.
            </p>
        </AnimateRerender>
    )
}

const UsersList = () => {
    const { users } = useStore()
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }, [users])

    return (
        <AnimateRerender>
            <div
                className="users"
                ref={listRef}
            >
                {users.map(user => (
                    <div key={user}>
                        {user}
                    </div>
                ))}
            </div>
        </AnimateRerender>
    )
}

const Table = () => {
    const { setUsers } = useStore()

    const fetchMoreUsers = async () => {
        const users = await fetchUsers()

        setUsers(prev => [...prev, ...users])
    }

    return (
        <AnimateRerender>
            <UsersList />
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
            <p>The timer is updating every second using a setInterval.</p>
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
