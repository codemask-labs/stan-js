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
import { createStore } from '@codemaskinc/store';

const { useStore } = createStore({
    count: 0,
});
```

3. Use the returned hook in your React component:

```typescript
import { useStore } from './someStoreInYourApp';

const App = () => {
    const { state: { count }, actions: { setCount } } = useStore();

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
            <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
        </div>
    );
};
```

## Examples

Access only part of state in store:

```typescript
import { createStore } from '@codemaskinc/store';

const { useStore } = createStore({
    firstName: 'John',
    lastName: 'Smith',
    age: 30
});

const App = () => {
    const {
        state: { firstName, age },
        actions: { setFirstName, setAge }
    } = useStore('firstName', 'age');

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

### Synchronizer

Synchronizer is util that allows you to synchronize store with some external object like localStorage, database, device storage etc.

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
