[![TypeScript](https://img.shields.io/badge/typescript-%230276C7?style=for-the-badge&logo=typescript&logoColor=%23fff&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/react-%23077EA4?style=for-the-badge&logo=react&logoColor=%23fff&link=https%3A%2F%2Freact.dev%2F)](https://react.dev/)
[![ReactNative](https://img.shields.io/badge/react%20native-%23282C34?style=for-the-badge&logo=react&logoColor=%2360DAFB&link=https%3A%2F%2Freact.dev%2F)](https://reactnative.dev/)
[![MIT](https://img.shields.io/npm/l/%40codemaskinc%2Fstore?style=for-the-badge)](https://mit-license.org/)
[![NPM Version](https://img.shields.io/npm/v/stan-js?style=for-the-badge&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fstan-js)](https://www.npmjs.com/package/stan-js)
[![NPM Downloads](https://img.shields.io/npm/dm/stan-js?style=for-the-badge&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fstan-js)](https://www.npmjs.com/package/stan-js)

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
- 🥳 No dependencies
- 🛡️ 100% Test coverage

## Installation

Install package using preferred package manager:

```bash
npm install stan-js
yarn add stan-js
pnpm add stan-js
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
    get doubleCounter() {
        return this.counter * 2
    }, 
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

Check out our [Docs](#) for more information and examples.
