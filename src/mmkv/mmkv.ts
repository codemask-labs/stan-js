import { MMKV } from 'react-native-mmkv'
import { Synchronizer } from '../types'

const mmkv = new MMKV()
const pendingChange = new Map<string, true>()

type StorageOptions<T> = {
    localStorageKey?: string
    deserialize?: (value: string) => T
    serialize?: (value: T) => string
}

type Storage = {
    <T>(initialValue: T, options?: StorageOptions<T>): T
    <T>(initialValue?: T, options?: StorageOptions<T>): T | undefined
}

export const mmkvStorage: Storage = <T>(
    initialValue: T,
    {
        deserialize = JSON.parse,
        serialize = JSON.stringify,
        localStorageKey,
    }: StorageOptions<T> = {},
) => ({
    value: initialValue,
    subscribe: (update, key) => {
        mmkv.addOnValueChangedListener(changedKey => {
            if (pendingChange.has(changedKey)) {
                pendingChange.delete(changedKey)

                return
            }

            const storageKey = localStorageKey ?? key

            if (changedKey !== storageKey) {
                return
            }

            const newValue = mmkv.getString(changedKey)

            if (newValue === undefined) {
                return
            }

            update(deserialize(newValue))
        })
    },
    update: (value, key) => {
        const storageKey = localStorageKey ?? key

        pendingChange.set(storageKey, true)
        mmkv.set(storageKey, serialize(value))
    },
    getSnapshot: key => {
        const storageKey = localStorageKey ?? key
        const value = mmkv.getString(storageKey)

        if (value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return deserialize(value)
    },
} as Synchronizer<T>)
