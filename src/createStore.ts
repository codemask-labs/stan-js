import equal from 'fast-deep-equal'
import { useEffect, useMemo, useReducer, useState, useSyncExternalStore } from 'react'
import { Actions, Dispatch, InitialState } from './types'
import { getActionKey, isPromise, isSynchronizer, optionalArray } from './utils'

const keyInObject = <T extends object>(key: PropertyKey, obj: T): key is keyof T => key in obj

export const createStore = <TState extends object>(stateRaw: InitialState<TState>) => {
    type TKey = keyof TState
    const storeKeys = Object.keys(stateRaw) as Array<TKey>

    const actions = storeKeys.reduce((acc, key) => ({
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
    }), {} as Actions<TState>)

    // @ts-expect-error
    const getAction = <K extends TKey>(key: K) => actions[getActionKey(key)] as (value: unknown) => void

    const listeners = storeKeys.reduce((acc, key) => ({
        ...acc,
        [key]: [],
    }), {} as { [K in TKey]: Array<(newState: TState[K]) => void> })

    const state = Object.entries(stateRaw).reduce((acc, [key, value]) => {
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

    const getState = (keys: Array<TKey>) => {
        let oldState: TState

        return () => {
            const newState = keys.reduce((acc, key) => ({
                ...acc,
                [key]: state[key],
            }), {}) as TState

            if (equal(oldState, newState)) {
                return oldState
            }

            oldState = newState

            return newState
        }
    }

    const useStore = () => {
        const [_, recalculate] = useReducer(() => ({}), {})
        const [subscribeKeys] = useState(() => new Set<TKey>())
        const getSnapshot = useMemo(() => {
            if (subscribeKeys.size === 0) {
                return () => state
            }

            return getState(Array.from(subscribeKeys))
        }, [_])
        const subscribeStore = useMemo(() => {
            if (subscribeKeys.size === 0) {
                return () => () => {}
            }

            return subscribe(Array.from(subscribeKeys))
        }, [_])
        const synced = useSyncExternalStore(subscribeStore, getSnapshot, getSnapshot)

        return new Proxy({ ...synced, ...actions }, {
            get: (target, key) => {
                if (storeKeys.includes(key as TKey) && !subscribeKeys.has(key as TKey)) {
                    subscribeKeys.add(key as TKey)
                    recalculate()
                }

                if (keyInObject(key, target)) {
                    return target[key]
                }

                return undefined
            },
        })
    }

    const reset = (...keys: Array<TKey>) => {
        optionalArray(keys, storeKeys).forEach(key => {
            const valueOrSynchronizer = stateRaw[key]
            const initialValue = isSynchronizer(valueOrSynchronizer) ? valueOrSynchronizer.value : valueOrSynchronizer

            getAction(key)(initialValue)
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

    const useStoreEffect = (run: (state: TState) => void) => {
        useEffect(() => {
            const dispose = effect(run)

            return dispose
        }, [])
    }

    return {
        useStore,
        getState: () => state,
        actions,
        reset,
        effect,
        useStoreEffect,
    }
}
