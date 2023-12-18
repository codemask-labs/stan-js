import equal from 'fast-deep-equal'
import { useMemo, useSyncExternalStore } from 'react'

export type Synchronizer<T> = {
    value: T,
    subscribe: (update: (value: T) => void, key: string) => VoidFunction,
    getSnapshot: (key: string) => T | null | undefined,
    update: (value: T, key: string) => void
}

const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`
const isSynchronizer = (value: unknown): value is Synchronizer<unknown> => {
    return typeof value === 'object' && value !== null && 'subscribe' in value && 'value' in value && 'update' in value && 'getSnapshot' in value
}
const optionalArray = <T>(arr: Array<T>, fallback: Array<T>) => arr.length > 0 ? arr : fallback

export const createStore = <TStateRaw extends object>(stateRaw: TStateRaw) => {
    type TState = { [K in keyof TStateRaw]: TStateRaw[K] extends Synchronizer<infer U> ? U : TStateRaw[K] }

    const storeKeys = Object.keys(stateRaw) as Array<keyof TState>

    const actions = storeKeys.reduce((acc, key) => ({
        ...acc,
        [`set${capitalize(String(key))}`]: (value: TState[typeof key]) => {
            state[key] = value
            listeners[key].forEach(listener => listener(value))
        }
    }), {} as { [K in keyof TState as `set${Capitalize<K & string>}`]: (value: TState[K]) => void })

    const listeners = storeKeys.reduce((acc, key) => ({
        ...acc,
        [key]: [],
    }), {} as { [K in keyof TState]: Array<(newState: TState[K]) => void> })

    const state = Object.entries(stateRaw).reduce((acc, [key, value]) => {
        if (isSynchronizer(value)) {
            // @ts-expect-error need to better type this
            value.subscribe(actions[`set${capitalize(key)}`], key)
            listeners[key as keyof TState].push(newValue => value.update(newValue, key))
            const snapshotValue = value.getSnapshot(key)

            if (!snapshotValue && value.value !== undefined) {
                value.update(value.value, key)
            }

            return {
                ...acc,
                [key]: snapshotValue ?? value.value
            }
        }

        return {
            ...acc,
            [key]: value
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
                [key]: state[key]
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
            const actionKey = `set${capitalize(String(key))}`

            return {
                ...acc,
                [actionKey]: actions[actionKey as keyof typeof actions] 
            }
        }, {} as { [K in keyof TState as `set${Capitalize<K & string>}`]: (value: TState[K]) => void })
    }

    const useStore = <TKeys extends Array<keyof TState>>(...keys: [...TKeys]) => {
        const getSnapshot = useMemo(() => getState(optionalArray(keys, storeKeys)), [])
        const actions = useMemo(() => getActions(optionalArray(keys, storeKeys)), [])
        const state = useSyncExternalStore(subscribe(optionalArray(keys, storeKeys)), getSnapshot)

        return {
            state,
            actions
        }
    }

    return {
        useStore,
        getState: () => state,
        actions,
    }
}
