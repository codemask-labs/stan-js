![TypeScript](https://img.shields.io/badge/typescript-%230276C7?style=for-the-badge&logo=typescript&logoColor=%23fff&link=https%3A%2F%2Fwww.typescriptlang.org%2F)
![React](https://img.shields.io/badge/react-%23077EA4?style=for-the-badge&logo=react&logoColor=%23fff&link=https%3A%2F%2Freact.dev%2F)
![ReactNative](https://img.shields.io/badge/react%20native-%23282C34?style=for-the-badge&logo=react&logoColor=%2360DAFB&link=https%3A%2F%2Freact.dev%2F)
![MIT](https://img.shields.io/npm/l/%40codemaskinc%2Fstore?style=for-the-badge)
![NPM Version](https://img.shields.io/npm/v/stan-js?style=for-the-badge&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fstan-js)
![NPM Downloads](https://img.shields.io/npm/dm/stan-js?style=for-the-badge&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fstan-js)

<img src="./assets/baner.png" alt="stan-js" width="100%" height="auto" />

## Overview

stan-js is a lightweight and flexible state management library designed for use in React, React Native and even vanilla-js applications. It simplifies the process of managing state in your application by providing a simple `createStore` function. This package aims to offer a straightforward solution for state management without the need for extensive type definitions or repetitive code.

## Features

- ⚡️ Performance and minimal rerenders
- ✍️ Simple configuration
- ⚛️ Out of the box React intergration
- 🚀 Amazing typescript intellisense
- 🪝 Easy access to all store values
- 🪶 Very lightweight
- 🛡️ 100% Test coverage

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

##### Astro + React

[![Open in repo](https://img.shields.io/badge/github-pages?style=for-the-badge&logo=github&logoColor=white&color=black
)](https://github.com/codemask-labs/stan-js/tree/main/examples/astro)
[![Open in StackBlitz](https://img.shields.io/badge/Stackblitz-fff?style=for-the-badge&logo=stackblitz&logoColor=white&labelColor=%231374EF&color=%231374EF
)](https://stackblitz.com/github/codemask-labs/stan-js/tree/main/examples/astro)

## Getting Started

Create a store with initial state:

You can think of a store as your app state. You can define multiple keys/values, each key will create separated subscription ([more explained here](#useStore)). If you want to persist the value - you can simply wrap it in [Synchronizer](#Synchronizer)

```typescript
import { createStore } from 'stan-js'
import { storage } from 'stan-js/storage'

export const { useStore } = createStore({
    count: 0,
    user: storage(''),
    selectedLanguage: 'en-US',
    unreadNotifications: [] as Array<Notification>
})
```

Use the returned hook in your React component:

```typescript
import { useStore } from './store'

const App = () => {
    const { count, user, setCount } = useStore()

    return (
        <div>
            <h1>Hello {user}!</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
            <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
        </div>
    )
}
```

Check [demos](#Demos) to play more with stan-js

## Features

```typescript
import { createStore } from 'stan-js'

export const { actions, getState, reset, effect, useStore, useStoreEffect } = createStore({
    count: 0,
    name: 'John',
    notifications: [] as Array<Notification>
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

reset('name', 'notifications')
// name and notifications will be reseted

reset()
// Whole store will be reseted
```

### effect

Function that allows to subscribe to store's values change and react to them

It takes callback with current store's state that will be triggered on every store's value that you are using

```typescript
const dispose = effect(({ count }) => {
    console.log(count)
})
```

If you won't pass any key to the dependencies it will trigger only once at the start - similarly to the ``useEffect`` hook

### useStore

React's hook that allows to access store's values and to update them

It **ONLY** rerenders the component if the values that we access have changed

```typescript
const { count, setCount, setName } = useStore()

console.log(count)

setCount(prev => prev + 1) // Component will rerender
setName('Anna') // Component won't rerender because it doesn't subscribe to name
```

### useStoreEffect

React's hook that uses [effect](#effect) under the hood

You should use it inside React components, and in the other places feel free to use ``effect``

```typescript
useStoreEffect(({ count }) => {
    console.log(count)
})
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

There is already implementation for [localStorage](#localStorage) and [react-native-mmkv](#react-native-mmkv).

```ts
import { storage } from 'stan-js/storage' // localStorage

import { mmkvStorage } from 'stan-js/mmkv' // react-native-mmkv
```
Both ``storage`` and ``mmkvStorage`` takes two parameters - first is initial value, and the second one which is optional is options object with key (if the key isn't passed stan-js will pass key from the store), serialize and deserialize functions.

*For react-native you need to install react-native-mmkv and if you are using react-native older than 0.72 you need to add this to your metro.config.js*
```js
unstable_enablePackageExports: true,
```

Read more about it [here](https://reactnative.dev/blog/2023/06/21/package-exports-support)

If you want to store more complex objects that aren't supported by JSON you can either write your own storage synchronizer or pass custom `serialize` and `deserialize` functions to the options parameter. For example, you can use [superjson](https://github.com/blitz-js/superjson) package:
```typescript
import { createStore } from 'stan-js'
import { storage } from 'stan-js/storage'
import superjson from 'superjson'

const { useStore } = createStore({
    user: storage(new Set(), {
        serialize: superjson.stringify,
        deserialize: superjson.deserialize
    })
})
```

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
const { name } = scopedStore.useStore()

return (
    <h1>
        Hello {name}
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
const { name } = scopedStore.useStore()

return (
    <h1>
        Hello {name}
    </h1>
)
```

#### Syncing values using synchronizer

##### localStorage

```typescript
import { createStore } from 'stan-js'
import { storage } from 'stan-js/storage'

const { useStore } = createStore({
    counter: storage(0, { storageKey: 'counter-key' }), // number
    user: storage<string>(), // string | undefined
    cart: [] as Array<CartItem>
})
```

##### react-native-mmkv

```typescript
import { createStore } from 'stan-js'
import { mmkvStorage } from 'stan-js/mmkv'

const { useStore } = createStore({
    counter: mmkvStorage(0, { storageKey: 'counter-key' }), // number
    user: mmkvStorage<string>(), // string | undefined
    cart: [] as Array<CartItem>
})
```
