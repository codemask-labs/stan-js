export type Synchronizer<T> = {
    value: T
    subscribe?: (update: (value: T) => void, key: string) => void
    getSnapshot: (key: string) => T | Promise<T>
    update: (value: T, key: string) => void
}

export type ActionKey<K> = `set${Capitalize<K & string>}`
export type Actions<TState extends object> =
    & { [K in keyof TState as ActionKey<K>]: (value: TState[K] | ((prevState: TState[K]) => TState[K])) => void }
    & {}
export type Dispatch<TState extends object, TKeys extends keyof TState> = TState[TKeys] | ((prevState: TState[TKeys]) => TState[TKeys])

type IsFunction<T> = T extends Function ? true : false
export type InitialState<TState extends object> = {
    [K in keyof TState]: IsFunction<TState[K]> extends true ? 'Function cannot be passed as top level state value' : TState[K]
}
