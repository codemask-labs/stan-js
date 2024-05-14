import { MMKV } from 'react-native-mmkv'
import { Storage, StorageOptions, Synchronizer } from '../types'

const mmkv = new MMKV()
const pendingChange = new Map<string, true>()

/**
 * A Synchronizer implementation using react-native-mmkv
 * @param initialValue - initial value of the storage
 * @param options.deserialize - function to deserialize the value from storage
 * @param options.serialize - function to serialize the value to storage
 * @param options.storageKey - key to use in storage
 * @see {@link https://github.com/codemask-labs/stan-js#Synchronizer}
 */
export const mmkvStorage: Storage = <T>(
    initialValue: T,
    {
        deserialize = JSON.parse,
        serialize = JSON.stringify,
        storageKey,
    }: StorageOptions<T> = {},
) => ({
    value: initialValue,
    subscribe: (update, key) => {
        mmkv.addOnValueChangedListener(changedKey => {
            if (pendingChange.has(changedKey)) {
                pendingChange.delete(changedKey)

                return
            }

            if (changedKey !== (storageKey ?? key)) {
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
        const storageKeyToUse = storageKey ?? key

        pendingChange.set(storageKeyToUse, true)
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
