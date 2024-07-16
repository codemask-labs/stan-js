import React, { createContext, DependencyList, FunctionComponent, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { createStore } from '.'
import { RemoveReadonly } from './types'
import { getActionKey, mergeState } from './utils'

type StoreProviderProps<TState extends object> = {
    initialValue?: Partial<RemoveReadonly<TState>>
    children: ReactNode
}

export const createScopedStore = <TState extends object>(initialState: TState) => {
    const StoreContext = createContext(createStore(initialState))
    const useScopedStore = () => useContext(StoreContext)

    const useStore = () => {
        const { useStore } = useContext(StoreContext)

        return useStore()
    }

    const useStoreEffect = (run: (state: TState) => void, deps: DependencyList = []) => {
        const { useStoreEffect } = useContext(StoreContext)

        useStoreEffect(run, deps)
    }

    const StoreProvider: FunctionComponent<StoreProviderProps<TState>> = ({ children, initialValue }) => {
        const [store] = useState(() => createStore(mergeState(initialState, initialValue ?? {})))
        const isMounted = useRef(false)

        useEffect(() => {
            if (!isMounted.current) {
                isMounted.current = true

                return
            }

            store.batchUpdates(() =>
                Object.entries(initialValue ?? {}).forEach(([key, value]) => {
                    // @ts-expect-error - TS can't infer action key properly
                    store.actions[getActionKey(key)](value)
                })
            )
        }, [initialValue])

        return <StoreContext.Provider children={children} value={store} />
    }

    const withStore = <TProps extends object>(Component: FunctionComponent<TProps>, initialValue?: Partial<TState>) => (props: TProps) => (
        <StoreProvider initialValue={initialValue}>
            <Component {...props} />
        </StoreProvider>
    )

    return {
        StoreProvider,
        useScopedStore,
        withStore,
        useStore,
        useStoreEffect,
    }
}
