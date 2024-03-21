import React, { createContext, FunctionComponent, ReactNode, useContext, useState } from 'react'
import { createStore, InitialState } from '.'

type StoreProviderProps<TState extends object> = {
    initialValue?: Partial<InitialState<TState>>
    children: ReactNode
}

export const createScopedStore = <TState extends object>(initialState: InitialState<TState>) => {
    const StoreContext = createContext(createStore(initialState))
    const useScopedStore = () => useContext(StoreContext)

    const StoreProvider: FunctionComponent<StoreProviderProps<TState>> = ({ children, initialValue }) => {
        const [store] = useState(() =>
            createStore({
                ...initialState,
                ...initialValue,
            })
        )

        return <StoreContext.Provider children={children} value={store} />
    }

    return {
        StoreProvider,
        useScopedStore,
    }
}
