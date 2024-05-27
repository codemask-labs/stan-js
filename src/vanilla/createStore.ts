import equal from 'fast-deep-equal'
import { Actions, Dispatch, RemoveReadonly } from '../types'
import { getActionKey, isPromise, isSynchronizer, keyInObject, optionalArray } from '../utils'

export const createStore = <TState extends object>(stateRaw: TState) => {
    type TKey = keyof TState
    const storeKeys = Object.keys(stateRaw) as Array<TKey>

    const actions = storeKeys.reduce((acc, key) => {
        if (Object.getOwnPropertyDescriptor(stateRaw, key)?.get !== undefined) {
            return acc
        }

        return {
            ...acc,
            [getActionKey(key)]: (value: Dispatch<TState, TKey>) => {
                if (typeof value === 'function') {
                    const fn = value as (prevState: TState[TKey]) => TState[TKey]
                    const newValue = fn(state[key])

                    state[key] = newValue
                    listeners[key].forEach(listener => listener(newValue))

                    return
                }

                state[key] = value
                listeners[key].forEach(listener => listener(value))
            },
        }
    }, {} as Actions<RemoveReadonly<TState>>)

    // @ts-expect-error
    const getAction = <K extends TKey>(key: K) => actions[getActionKey(key)] as (value: unknown) => void

    const listeners = storeKeys.reduce((acc, key) => ({
        ...acc,
        [key]: [],
    }), {} as { [K in TKey]: Array<(newState: TState[K]) => void> })

    const state = Object.entries(stateRaw).reduce((acc, [key, value]) => {
        if (Object.getOwnPropertyDescriptor(stateRaw, key)?.get !== undefined) {
            return acc
        }

        if (typeof value === 'function') {
            throw new Error('Function cannot be passed as top level state value')
        }

        if (isSynchronizer(value)) {
            value.subscribe?.(getAction(key as TKey), key)
            listeners[key as TKey].push(newValue => value.update(newValue, key))

            try {
                const snapshotValue = value.getSnapshot(key)

                if (isPromise(snapshotValue)) {
                    snapshotValue.then(snapshotValue => {
                        if (snapshotValue !== undefined && snapshotValue !== null) {
                            getAction(key as TKey)(snapshotValue)

                            return
                        }

                        value.update(value.value, key)
                    }).catch()

                    // Return initial value
                    return {
                        ...acc,
                        [key]: value.value,
                    }
                }

                return {
                    ...acc,
                    [key]: snapshotValue,
                }
            } catch {
                // If getSnapshot throws, return initial value and set it in storage
                value.update(value.value, key)

                return {
                    ...acc,
                    [key]: value.value,
                }
            }
        }

        return {
            ...acc,
            [key]: value,
        }
    }, {} as TState)

    const subscribe = (keys: Array<TKey>) => (listener: VoidFunction) => {
        keys.forEach(key => listeners[key].push(listener))

        return () => {
            keys.forEach(key => {
                listeners[key] = listeners[key].filter(l => l !== listener)
            })
        }
    }

    storeKeys.forEach(key => {
        if (Object.getOwnPropertyDescriptor(stateRaw, key)?.get === undefined) {
            return
        }

        const proxiedState = new Proxy(state, {
            get: (target, dependencyKey, receiver) => {
                if (!keyInObject(dependencyKey, target)) {
                    return undefined
                }

                subscribe([dependencyKey])(() => {
                    const newValue = Object.getOwnPropertyDescriptor(stateRaw, key)?.get?.call(target)

                    if (equal(target[key], newValue)) {
                        return
                    }

                    target[key] = newValue
                    listeners[key].forEach(listener => listener(newValue))
                })

                return Reflect.get(target, dependencyKey, receiver)
            },
        })

        state[key] = Object.getOwnPropertyDescriptor(stateRaw, key)?.get?.call(proxiedState)
    })

    const reset = (...keys: Array<keyof RemoveReadonly<TState>>) => {
        optionalArray(keys, storeKeys).forEach(key => {
            const valueOrSynchronizer = stateRaw[key]
            const initialValue = isSynchronizer(valueOrSynchronizer) ? valueOrSynchronizer.value : valueOrSynchronizer

            getAction(key)?.(initialValue)
        })
    }

    const effect = (run: (state: TState) => void) => {
        const disposers = new Set<VoidFunction>()

        run(
            new Proxy(state, {
                get: (target, key) => {
                    if (storeKeys.includes(key as TKey)) {
                        disposers.add(subscribe([key as TKey])(() => run(state)))
                    }

                    if (keyInObject(key, target)) {
                        return target[key]
                    }

                    return undefined
                },
            }),
        )

        if (disposers.size === 0) {
            storeKeys.forEach(key => disposers.add(subscribe([key])(() => run(state))))
        }

        return () => disposers.forEach(dispose => dispose())
    }

    return {
        /**
         * Function that returns current state of the store
         * @see {@link https://github.com/codemask-labs/stan-js#getState}
         */
        getState: () => state,
        /**
         * Object that contains all functions that allows for updating the store's state
         * @see {@link https://github.com/codemask-labs/stan-js#actions}
         */
        actions,
        /**
         * Function that resets store state to the initial values
         * @param keys - keys of the store that should be reset
         * @see {@link https://github.com/codemask-labs/stan-js#reset}
         */
        reset,
        /**
         * Function that allows to subscribe to store's values change and react to them by calling the listener callback
         * @param run - callback that will be called when store's values change
         * @see {@link https://github.com/codemask-labs/stan-js#effect}
         */
        effect,
        /**
         * Function that returns a function that allows to listen to store's values change
         * @param keys - keys of the store that should be listened to
         * @returns Function that allows for listening to store's values change
         */
        subscribe,
    }
}
