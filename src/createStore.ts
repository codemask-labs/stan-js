import { DependencyList, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Actions, CustomActions, CustomActionsBuilder, Prettify, RemoveReadonly } from './types'
import { equal, getActionKey, keyInObject } from './utils'
import { createStore as createStoreVanilla } from './vanilla'

/**
 * Function that creates a store.
 * @param stateRaw - initial state of the store
 * @param customActionsBuilder - function to create custom actions
 *
 * @see {@link https://codemask-labs.github.io/stan-js/reference/createstore}
 */
export const createStore = <TState extends object, TCustomActions extends CustomActions = {}>(
    stateRaw: TState,
    customActionsBuilder?: CustomActionsBuilder<TState, TCustomActions>,
) => {
    type TKey = keyof TState
    const storeKeys = Object.keys(stateRaw) as Array<TKey>
    const store = createStoreVanilla(stateRaw, customActionsBuilder)

    const getState = () => {
        let oldState: TState

        return () => {
            const currentState = { ...store.getState() }

            if (equal(oldState, currentState)) {
                return oldState
            }

            oldState = currentState

            return currentState
        }
    }

    type UseStoreReturn = Prettify<TState & Actions<RemoveReadonly<TState>> & TCustomActions>
    const useStore = (): UseStoreReturn => {
        const [isInitialized, setIsInitialized] = useState(false)
        const [subscribeKeys] = useState(() => new Set<TKey>())
        const getSnapshot = useMemo(() => {
            if (subscribeKeys.size === 0) {
                return store.getState
            }

            return getState()
        }, [isInitialized])
        const subscribeStore = useMemo(() => {
            if (subscribeKeys.size === 0) {
                // eslint-disable-next-line no-empty-function
                return () => () => {}
            }

            return store.subscribe(Array.from(subscribeKeys))
        }, [isInitialized])
        const synced = useSyncExternalStore(subscribeStore, getSnapshot, getSnapshot)

        if (isInitialized) {
            return { ...synced, ...store.actions } as UseStoreReturn
        }

        return new Proxy({ ...synced, ...store.actions } as UseStoreReturn, {
            get: (target, key) => {
                if (storeKeys.includes(key as TKey) && !subscribeKeys.has(key as TKey)) {
                    subscribeKeys.add(key as TKey)
                    setIsInitialized(true)
                }

                if (keyInObject(key, target)) {
                    return target[key]
                }

                return undefined
            },
        })
    }

    const useStoreEffect = (run: (state: TState) => void, deps: DependencyList = []) => {
        const isMounted = useRef(false)
        const callbackRef = useRef(run)

        useEffect(() => {
            const dispose = store.effect(state => callbackRef.current(state))

            return dispose
        }, [])

        useEffect(() => {
            callbackRef.current = run
        }, [run])

        useEffect(() => {
            // To prevent double callback firing on mount
            if (!isMounted.current) {
                isMounted.current = true

                return
            }

            run(store.getState())
        }, deps)
    }

    const getAction = <K extends TKey>(key: K) => store.actions[getActionKey(key)] as (value: unknown) => void

    const useHydrateState = (state: Prettify<Partial<RemoveReadonly<TState>>>) => {
        const isMounted = useRef(false)

        if (!isMounted.current) {
            isMounted.current = true

            store.batchUpdates(() => Object.entries(state).forEach(([key, value]) => getAction(key as keyof typeof state)?.(value)))
        }
    }

    return {
        actions: store.actions,
        getState: store.getState,
        effect: store.effect,
        reset: store.reset,
        batchUpdates: store.batchUpdates,
        /**
         * React's hook that allows to access store's values and to update them
         * @returns Store's values and actions
         * @see {@link https://codemask-labs.github.io/stan-js/reference/createstore#usestore}
         */
        useStore,
        /**
         * React's hook that allows to subscribe to store's values and react to them by calling the listener callback
         * @param run - callback that will be called when store's values change
         * @see {@link https://codemask-labs.github.io/stan-js/reference/createstore#usestoreeffect}
         */
        useStoreEffect,
        /**
         * React's hook that allows to hydrate store's state with the provided values once on mount
         * @param state - values that should be used to hydrate the store
         * @see {@link https://codemask-labs.github.io/stan-js/reference/createstore#usehydratestate}
         */
        useHydrateState,
    }
}
