import React, { createContext, FunctionComponent, ReactNode, useContext, useState } from 'react'
import { createStore } from '.'
import { InitialState } from './types'

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

    const withStore =
        <TProps extends object>(Component: FunctionComponent<TProps>, initialValue?: Partial<InitialState<TState>>) => (props: TProps) => (
            <StoreProvider initialValue={initialValue}>
                <Component {...props} />
            </StoreProvider>
        )

    return {
        StoreProvider,
        useScopedStore,
        withStore,
    }
}
