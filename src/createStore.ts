import equal from 'fast-deep-equal'
import { useEffect, useMemo, useReducer, useState, useSyncExternalStore } from 'react'
import { InitialState } from './types'
import { keyInObject } from './utils'
import { createStore as createStoreVanilla } from './vanilla'

export const createStore = <TState extends object>(stateRaw: InitialState<TState>) => {
    type TKey = keyof TState
    const storeKeys = Object.keys(stateRaw) as Array<TKey>
    const store = createStoreVanilla<TState>(stateRaw)

    const getState = (keys: Array<TKey>) => {
        let oldState: TState

        return () => {
            const currentState = store.getState()
            const newState = keys.reduce((acc, key) => ({
                ...acc,
                [key]: currentState[key],
            }), {} as TState)

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
                return store.getState
            }

            return getState(Array.from(subscribeKeys))
        }, [_])
        const subscribeStore = useMemo(() => {
            if (subscribeKeys.size === 0) {
                return () => () => {}
            }

            return store.subscribe(Array.from(subscribeKeys))
        }, [_])
        const synced = useSyncExternalStore(subscribeStore, getSnapshot, getSnapshot)

        return new Proxy({ ...synced, ...store.actions }, {
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

    const useStoreEffect = (run: (state: TState) => void) => {
        useEffect(() => {
            const dispose = store.effect(run)

            return dispose
        }, [])
    }

    return {
        actions: store.actions,
        getState: store.getState,
        effect: store.effect,
        reset: store.reset,
        useStore,
        useStoreEffect,
    }
}
