export type Synchronizer<T> = {
    value: T
    subscribe?: (update: (value: T) => void, key: string) => void
    getSnapshot: (key: string) => T | Promise<T>
    update: (value: T, key: string) => void
}

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
type GetReadonlyKeys<T> = keyof {
    [K in keyof T as Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? K : never]: K
}

export type RemoveReadonly<T> = Omit<T, GetReadonlyKeys<T>>

export type ActionKey<K> = `set${Capitalize<K & string>}`
export type Actions<TState extends object> =
    & { [K in keyof TState as ActionKey<K>]: (value: TState[K] | ((prevState: TState[K]) => TState[K])) => void }
    & {}
export type Dispatch<TState extends object, TKeys extends keyof TState> = TState[TKeys] | ((prevState: TState[TKeys]) => TState[TKeys])

export type StorageOptions<T> = {
    storageKey?: string
    deserialize?: (value: string) => T
    serialize?: (value: T) => string
}

export type Storage = {
    <T>(initialValue: T, options?: StorageOptions<T>): T
    <T>(initialValue?: T, options?: StorageOptions<T>): T | undefined
}

export type Prettify<T> =
    & {
        [K in keyof T]: T[K]
    }
    & {}
