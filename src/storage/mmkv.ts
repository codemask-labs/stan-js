import { MMKV } from 'react-native-mmkv'
import { Storage, StorageOptions, Synchronizer } from '../types'

const mmkv = new MMKV()

export const storage: Storage = <T>(
    initialValue: T,
    {
        deserialize = JSON.parse,
        serialize = JSON.stringify,
        storageKey,
    }: StorageOptions<T> = {},
) => ({
    value: initialValue,
    update: (value, key) => {
        const storageKeyToUse = storageKey ?? key

        if (value === undefined) {
            mmkv.delete(storageKeyToUse)

            return
        }

        mmkv.set(storageKeyToUse, serialize(value))
    },
    getSnapshot: key => {
        const value = mmkv.getString(storageKey ?? key)

        if (value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return deserialize(value)
    },
} as Synchronizer<T>)
