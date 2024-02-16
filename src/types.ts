export type Synchronizer<T> = {
    value: T
    subscribe?: (update: (value: T) => void, key: string) => VoidFunction
    getSnapshot: (key: string) => T | Promise<T>
    update: (value: T, key: string) => void
}

export type ActionKey<K> = `set${Capitalize<K & string>}`
export type Actions<TState extends object> = { [K in keyof TState as ActionKey<K>]: (value: Dispatch<TState, K> & {}) => void } & {}
export type Dispatch<TState extends object, Keys extends keyof TState> = TState[Keys] | ((prevState: TState[Keys]) => TState[Keys])
export type PickState<TState extends object, TKeys extends keyof TState> = { [K in TKeys]: TState[K] } & {}

type IsFunction<T> = T extends Function ? true : false
export type InitialState<TState extends object> = {
    [K in keyof TState]: IsFunction<TState[K]> extends true ? 'Function cannot be passed as top level state value' : TState[K]
}
