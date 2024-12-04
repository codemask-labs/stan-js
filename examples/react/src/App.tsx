import { useEffect, useRef } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { fetchUsers, getState, reset, useStore } from './store'

const CurrentTime = () => {
    const { currentTime } = useStore()

    return <h2 className="text-xl">{currentTime.toLocaleTimeString()}</h2>
}

const Message = () => {
    const { upperCaseMessage } = useStore()

    return (
        <span className="mb-2">
            Uppercased message: <b>{upperCaseMessage}</b>
        </span>
    )
}

const MessageInput = () => {
    const { setMessage } = useStore()

    return (
        <Input
            defaultValue={getState().message}
            onChange={event => setMessage(event.target.value)}
        />
    )
}

const CounterDisplay = () => {
    const { counter } = useStore()

    return <h2 className="text-2xl font-bold text-center">{counter}</h2>
}

const CounterControls = () => {
    const { setCounter } = useStore()

    return (
        <div className="flex flex-col">
            <div className="flex justify-center gap-4 mt-2">
                <Button onClick={() => setCounter(prev => prev - 1)}>Decrement</Button>
                <Button onClick={() => setCounter(prev => prev + 1)}>Increment</Button>
            </div>
            <div className="mx-auto my-2">
                <Button onClick={() => reset('counter')}>Reset counter</Button>
            </div>
            <CardDescription className="text-center">
                Counter is incremented and decremented using <span>actions</span>,<br />and can be reset using <span>reset</span> function.
            </CardDescription>
        </div>
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
        <div
            className="h-80 overflow-auto flex flex-col items-center justify-center mb-4"
            ref={listRef}
        >
            {users.length === 0 && <span>Press the button to fetch users.</span>}
            {users.map(user => (
                <div key={user}>
                    {user}
                </div>
            ))}
        </div>
    )
}

const FetchMore = () => {
    const { setUsers } = useStore()

    const fetchMoreUsers = async () => {
        const users = await fetchUsers()

        setUsers(prev => [...prev, ...users])
    }

    return (
        <Button onClick={fetchMoreUsers}>
            Fetch more users
        </Button>
    )
}

export const App = () => (
    <div className="p-4 flex flex-col max-w-xl mx-auto gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Updates & Reset</CardTitle>
                <CardDescription>Automatically generated functions for updates and reset.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
                <CounterDisplay />
                <CounterControls />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Asynchronous updates</CardTitle>
                <CardDescription>Asynchronus updates works without any additional code.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
                <UsersList />
                <FetchMore />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Updates outside of React</CardTitle>
                <CardDescription>Update the state outside of React without any issues.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <CurrentTime />
                <CardDescription>
                    The timer is updating every second using a setInterval.
                </CardDescription>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Computed values</CardTitle>
                <CardDescription>Create computed value based on another value in store.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
                <Message />
                <MessageInput />
            </CardContent>
        </Card>
    </div>
)
