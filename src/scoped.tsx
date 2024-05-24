import React, { createContext, FunctionComponent, ReactNode, useContext, useState } from 'react'
import { createStore } from '.'

type StoreProviderProps<TState extends object> = {
    initialValue?: Partial<TState>
    children: ReactNode
}

export const createScopedStore = <TState extends object>(initialState: TState) => {
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

    const withStore = <TProps extends object>(Component: FunctionComponent<TProps>, initialValue?: Partial<TState>) => (props: TProps) => (
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
