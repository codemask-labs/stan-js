import equal from 'fast-deep-equal'
import { useMemo, useSyncExternalStore } from 'react'
import { Actions, Dispatch, NonFunction, Synchronizer } from './types'
import { getActionKey, isPromise, isSynchronizer, optionalArray } from './utils'

export const createStore = <TStateRaw extends Record<string, NonFunction>>(stateRaw: TStateRaw) => {
    type TState = { [K in keyof TStateRaw]: TStateRaw[K] extends Synchronizer<infer U> ? U : TStateRaw[K] }

    const storeKeys = Object.keys(stateRaw) as Array<keyof TState>

    const actions = storeKeys.reduce((acc, key) => ({
        ...acc,
        [getActionKey(key)]: (value: Dispatch<TState, typeof key>) => {
            if (typeof value === 'function') {
                const fn = value as (prevState: TState[typeof key]) => TState[typeof key]
                const newValue = fn(state[key])

                state[key] = newValue
                listeners[key].forEach(listener => listener(newValue))

                return
            }

            state[key] = value
            listeners[key].forEach(listener => listener(value))
        },
    }), {} as Actions<TState>)
    const getAction = <K extends keyof TState>(key: K) => actions[getActionKey(key)] as (value: unknown) => void

    const listeners = storeKeys.reduce((acc, key) => ({
        ...acc,
        [key]: [],
    }), {} as { [K in keyof TState]: Array<(newState: TState[K]) => void> })

    const state = Object.entries(stateRaw).reduce((acc, [key, value]) => {
        if (isSynchronizer(value)) {
            value.subscribe(getAction(key), key)
            listeners[key as keyof TState].push(newValue => value.update(newValue, key))

            try {
                const snapshotValue = value.getSnapshot(key)

                if (isPromise(snapshotValue)) {
                    snapshotValue.then(snapshotValue => {
                        if (snapshotValue !== undefined && snapshotValue !== null) {
                            getAction(key)(snapshotValue)

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
    }, {}) as { [K in keyof TState]: TState[K] }

    const subscribe = <TKeys extends Array<keyof TState>>(keys: TKeys) => (listener: VoidFunction) => {
        keys.forEach(key => listeners[key].push(listener))

        return () => {
            keys.forEach(key => {
                listeners[key] = listeners[key].filter(l => l !== listener)
            })
        }
    }

    const getState = <TKeys extends Array<keyof TState>>(keys: TKeys) => {
        let oldState: { [K in keyof TState]: TState[K] }

        return () => {
            const newState = keys.reduce((acc, key) => ({
                ...acc,
                [key]: state[key],
            }), {} as { [K in keyof TState]: TState[K] })

            if (equal(oldState, newState)) {
                return oldState
            }

            oldState = newState

            return newState
        }
    }

    const getActions = <TKeys extends Array<keyof TState>>(keys: TKeys) => {
        return keys.reduce((acc, key) => {
            const actionKey = getActionKey(key)

            return {
                ...acc,
                [actionKey]: getAction(key),
            }
        }, {} as Actions<TState>)
    }

    const useStore = <TKeys extends Array<keyof TState>>(...keys: [...TKeys]) => {
        const getSnapshot = useMemo(() => getState(optionalArray(keys, storeKeys)), [])
        const actions = useMemo(() => getActions(optionalArray(keys, storeKeys)), [])
        const state = useSyncExternalStore(subscribe(optionalArray(keys, storeKeys)), getSnapshot, getSnapshot)

        return {
            state,
            actions,
        }
    }

    const reset = <TKeys extends Array<keyof TState>>(...keys: [...TKeys]) => {
        optionalArray(keys, storeKeys).forEach(key => {
            const valueOrSynchronizer = stateRaw[key]
            const initialValue = (isSynchronizer(valueOrSynchronizer) ? valueOrSynchronizer.value : valueOrSynchronizer) as TStateRaw[keyof TStateRaw]

            getAction(key)(initialValue)
        })
    }

    const effect = <TKeys extends Array<keyof TState>>(run: (state: TState) => void, deps: [...TKeys]) => {
        run(getState(storeKeys)())

        return subscribe(deps)(() => {
            run(getState(storeKeys)())
        })
    }

    return {
        useStore,
        getState: () => state,
        actions,
        reset,
        effect,
    }
}
