## Overview

`@codemaskinc/store` is a lightweight and flexible state management library designed for use in React applications and beyond. It simplifies the process of managing state in your application by providing a simple `createStore` function that seamlessly integrates with React's built-in API, `useSyncExternalStore`. This package aims to offer a straightforward solution for state management without the need for extensive type definitions or repetitive code.

## Features

- ✍️ **Simplicity:** Easily create and manage stores with a simple `createStore` function. Avoids the redundancy often encountered in Jotai, where similar code is replicated across different stores.
- ⚛️ **React Integration:** Seamlessly use the stores in your React components with the help of `useSyncExternalStore`.
- 🚀 **TypeScript Support:** Benefit from TypeScript magic for type-safe state and methods without the need for manual type definitions. Eliminates the complexity of writing your own types for state and methods as required in Zustand.
- ⚡️ **Performance:** Utilizes `fast-deep-equal` for efficient state comparison, ensuring minimal re-renders and optimal performance.

## Installation

Install package using preferred package manager:

```bash
npm install @codemaskinc/store
# or
yarn add @codemaskinc/store
# or
bun add @codemaskinc/store
```

## Getting Started

1. Create a store with initial state:

```typescript
import { createStore } from '@codemaskinc/store'

export const { useStore } = createStore({
    count: 0,
})
```

3. Use the returned hook in your React component:

```typescript
import { useStore } from './store'

const App = () => {
    const { state: { count }, actions: { setCount } } = useStore()

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
            <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
        </div>
    )
}
```

## Features

```typescript
import { createStore } from '@codemaskinc/store'

export const { actions, getState, reset, effect, useStore, useStoreEffect } = createStore({
    count: 0,
    name: 'John'
})
```

### actions

Object that contains all functions that allows for updating the store's state

Action name is generated automatically based on given key to the store ``count -> setCount``

You can pass the next state directly, or a function that calculates it from the previous state - similary to the ``useState`` hook

### getState

Function that returns current state of the store

```typescript
const { count } = getState()

console.log(count)
```

### reset

Function that resets store state to the initial values

You can either pass all of the keys that you want to be reset, or if you won't pass any key **WHOLE** store will be reseted.

```typescript
reset('count')
// Only count value will be reseted

reset()
// Whole store will be reseted
```

### effect

Function that allows to subscribe to store's values change and react to them

It takes callback with current store's state that will be triggered on store's change, and as a second argument it takes array of dependencies that will listen to

```typescript
const dispose = effect(({ count }) => {
    console.log(count)
}, ['count'])
```

If you won't pass any key to the dependencies it will trigger only once at the start - similarly to the ``useEffect`` hook

### useStore

React's hook that allows to access store's values and update them

It takes store's keys as arguments, if you won't provide any argument it will return the **WHOLE** store

It will return object with state, and [actions](#actions). State is object with reactive fields from the store, it will rerender automatically whenever store value has changed

```typescript
const { state, actions } = useStore('count')

console.log(state.count)
console.log(state.name) // ❌ error, name doesn't exist

actions.setCount(prev => prev + 1)
actions.setName('Anna') // ❌ error, setName doesn't exist
```

```typescript
const { state, actions } = useStore()

console.log(state.count)
console.log(state.name)

actions.setCount(prev => prev + 1)
actions.setName('Anna')
```

### useStoreEffect

React's hook that uses [effect](#effect) under the hood

Inside React components you should use it, and in the other places you can use effect

```typescript
useStoreEffect(({ count }) => {
    console.log(count)
}, ['count'])
```

### Synchronizer

Synchronizer is an util that allows you to synchronize store with something external like localStorage, database, device storage etc.

```typescript
type Synchronizer<T> = {
    value: T,
    subscribe: (update: (value: T) => void, key: string) => VoidFunction,
    // If synchronizer doesn't have data that matches passed key, it should throw
    getSnapshot: (key: string) => T | Promise<T>,
    update: (value: T, key: string) => void
}
```

You can find sample `Synchronizer` implementation for localStorage [here](https://github.com/codemaskinc/createStore/blob/main/src/storage.ts)

## Scoped store

If your app is SSR or for example you just want to have the same store shape but keep different values for different routes you can use scoped store

It returns:
- ``StoreProvider`` - Provider that passes scoped store down to the React's tree
- ``withStore`` - HOC that passes scoped store down to the React's tree
- ``useScopedStore`` - React hook used to access scoped store

```typescript
import { createScopedStore } from '@codemaskinc/store'

export const { StoreProvider, useScopedStore, withStore } = createScopedStore({
    count: 0,
})
``` 

## Examples

#### Access only part of state in store:

```typescript
import { createStore } from '@codemaskinc/store'

const { useStore } = createStore({
    firstName: 'John',
    lastName: 'Smith',
    age: 30
})

const App = () => {
    const {
        state: { firstName, age },
        actions: { setFirstName, setAge }
    } = useStore('firstName', 'age')

    return (
        <div>
            <p>Name: {firstName}</p>
            <input
                type="text"
                value={firstName}
                onChange={event => setFirstName(event.currentTarget.value)}
            />
            <p>Age: {age}</p>
            <input
                type="number"
                value={age}
                onChange={event => setAge(event.currentTarget.value)}
            />
        </div>
    );
};
```

#### SSR scoped store:

```typescript
import { createScopedStore } from '@codemaskinc/store'

export const { StoreProvider, useScopedStore } = createScopedStore({
    count: 0,
    name: 'John'
})
``` 

```typescript
// SSR Layout

<Layout>
    <StoreProvider initialValue={{ name: await db.getUser().name }}>
        {children}
    </StoreProvider>
</Layout>
```

```typescript
// Some client component inside layout

const scopedStore = useScopedStore()
const { state } = scopedStore.useStore('name')

return (
    <h1>
        Hello {state.name}
    </h1>
)
```

#### Scoped store with regular routing

```typescript
import { createScopedStore } from '@codemaskinc/store'

export const { StoreProvider, useScopedStore } = createScopedStore({
    count: 0,
    name: 'John'
})
``` 

```typescript
const ProfileScreen = withStore(() => {
    // Component body...
})
```

```typescript
// Some component inside ProfileScreen

const scopedStore = useScopedStore()
const { state } = scopedStore.useStore('name')

return (
    <h1>
        Hello {state.name}
    </h1>
)
```

#### Syncing values using synchronizer

```typescript
import { createStore, storage } from '@codemaskinc/store'
import { type CartItem } from 'lib/models'

const { useStore } = createStore({
    counter: storage(0), // number
    user: storage<string>(), // string | undefined
    cart: [] as Array<CartItem>
})
```
