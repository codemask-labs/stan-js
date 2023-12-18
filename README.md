## Features
- ⚛️ updates outside react components
- 🪝 easy access to all store values
- ✍️ no repeating yourself
- ⚡️ no unnecessary rerenders
- 🚀 typescript intellisense

## Motivation
[Zustand](https://github.com/pmndrs/zustand) is great, but you must write your own types for all stores (state, methods, etc.)
--- ---
[Jotai](https://jotai.org/) is also great, but you would most likely end up creating close to identical code for each store

``([a, setA] = useAtom(aAtom), [b, setB] = useAtom(bAtom))``
--- ---

This simple createStore function solves all of those problems, using simple built in react api [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore), [fast-deep-equal](https://www.npmjs.com/package/fast-deep-equal) and some typescript magic 🪄

## Example usage

```tsx
import { storage, createStore } from './store'

const { useStore } = createStore({
    hello: 'hello',
    world: storage('world')
})

const Hello = () => {
    const { state, actions } = useStore('hello')

    return <input value={state.hello} onChange={event => actions.setHello(event.target.value)} />
}

const World = () => {
    const { state, actions } = useStore('world')

    return <input value={state.world} onChange={event => actions.setWorld(event.target.value)} />
}

const App = () => {
    return (
        <>
            <Hello />
            <br/>
            <World />
        </>
    )
}
```

## createStore

It takes object which is initial state of the store and returns:

### useStore
Hook that allows to subscribe and update given properties of store, based on keys which you pass into it

```ts
const { useStore } = createStore({ test: 'test' })
```

### getState
Returns current state of the store

```ts
const { getState } = createStore({ test: 'test' })

console.log(getState().test)
```

### actions
Object that contains of all actions to update store properties

```ts
const { actions } = createStore({ test: 'test' })

actions.setTest('hello world)
```

## storage

Allows to synchronize store with localStorage

```ts
const { useStore } = createStore({
    hello: storage<string>(), // string | undefined
    world: storage('world'),
    user: storage<User | null>(null, 'STORAGE_USER')
})
```
It takes two parameters, both are optional - ``initialValue`` and ``storageKey``

If you want pass storageKey into it, it will use the key that you've used as its name in initial store value (👆 hello and world are examples of that)

## Synchronizer

Synchronizer is util that allows to synchronize store with something external localStorage, database, device storage etc.

[storage](#storage) is example of it

```ts
type Synchronizer<T> = {
    value: T,
    subscribe: (update: (value: T) => void, key: string) => VoidFunction,
    getSnapshot: (key: string) => T | null | undefined,
    update: (value: T, key: string) => void
}
```
