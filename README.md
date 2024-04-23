![TypeScript](https://img.shields.io/badge/typescript-%230276C7?style=for-the-badge&logo=typescript&logoColor=%23fff&link=https%3A%2F%2Fwww.typescriptlang.org%2F)
![React](https://img.shields.io/badge/react-%23077EA4?style=for-the-badge&logo=react&logoColor=%23fff&link=https%3A%2F%2Freact.dev%2F)
![ReactNative](https://img.shields.io/badge/react%20native-%23282C34?style=for-the-badge&logo=react&logoColor=%2360DAFB&link=https%3A%2F%2Freact.dev%2F)
![MIT](https://img.shields.io/npm/l/%40codemaskinc%2Fstore?style=for-the-badge)
![NPM Version](https://img.shields.io/npm/dm/stan-js?style=for-the-badge&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fstan-js)
![NPM Downloads](https://img.shields.io/npm/dm/stan-js?style=for-the-badge&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fstan-js)


## Overview

stan-js is a lightweight and flexible state management library designed for use in React applications and beyond. It simplifies the process of managing state in your application by providing a simple `createStore` function. This package aims to offer a straightforward solution for state management without the need for extensive type definitions or repetitive code.

## Features

- ⚡️ Performance and minimal rerenders
- ✍️ Simple with minimal configuration
- ⚛️ Out of the box React intergration
- 🚀 Amazing typescript intellisense
- 🪝 Easy access to all store values
- 🪶 Very lightweight

## Installation

Install package using preferred package manager:

```bash
npm install stan-js
# or
yarn add stan-js
# or
bun add stan-js
```

## Demos

##### React

[![Open in repo](https://img.shields.io/badge/github-pages?style=for-the-badge&logo=github&logoColor=white&color=black
)](https://github.com/codemask-labs/stan-js/tree/main/examples/react)
[![Open in StackBlitz](https://img.shields.io/badge/Stackblitz-fff?style=for-the-badge&logo=stackblitz&logoColor=white&labelColor=%231374EF&color=%231374EF
)](https://stackblitz.com/github/codemask-labs/stan-js/tree/main/examples/react)

## Getting Started

Create a store with initial state:

```typescript
import { createStore } from 'stan-js'

export const { useStore } = createStore({
    count: 0,
})
```

Use the returned hook in your React component:

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
import { createStore } from 'stan-js'

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

It **ONLY** rerenders the component if the given keys' values have changed

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

You should use it inside React components, and in the other places you feel free to use ``effect``

```typescript
useStoreEffect(({ count }) => {
    console.log(count)
}, ['count'])
```

### Synchronizer

Synchronizer is an util that allows you to synchronize store with something external like localStorage, database, device storage (MMKV, AsyncStorage) etc.

```typescript
type Synchronizer<T> = {
    value: T,
    subscribe: (update: (value: T) => void, key: string) => void,
    // If synchronizer doesn't have data that matches passed key, it should throw
    getSnapshot: (key: string) => T | Promise<T>,
    update: (value: T, key: string) => void
}
```

There is already implementation for localStorage and react-native-mmkv.
```ts
import { storage } from 'stan-js/storage' // localStorage

import { mmkvStorage } from 'stan-js/mmkv' // react-native-mmkv
```

*For react-native you need to install react-native-mmkv and if you are using react-native older than 18 you need to add this to your metro.config.js*
```js
unstable_enablePackageExports: true,
```

Read more about it [here](https://reactnative.dev/blog/2023/06/21/package-exports-support)

## Scoped store

If your app is SSR or for example you just want to have the same store shape but keep different values for different routes you can use scoped store

It returns:
- ``StoreProvider`` - Provider that passes scoped store down to the React's tree
- ``withStore`` - HOC that passes scoped store down to the React's tree
- ``useScopedStore`` - React hook used to access scoped store

```typescript
import { createScopedStore } from 'stan-js'

export const { StoreProvider, useScopedStore, withStore } = createScopedStore({
    count: 0,
})
``` 

## Examples

#### Access only part of state in store:

```typescript
import { createStore } from 'stan-js'

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
import { createScopedStore } from 'stan-js'

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
import { createScopedStore } from 'stan-js'

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
import { createStore, storage } from 'stan-js'
import { type CartItem } from 'lib/models'

const { useStore } = createStore({
    counter: storage(0), // number
    user: storage<string>(), // string | undefined
    cart: [] as Array<CartItem>
})
```
