import { MMKV } from 'react-native-mmkv'
import { CreateStorageOptions, StorageOptions, Synchronizer } from '../types'

export const createStorage = (storageOptions?: CreateStorageOptions) =>
<T>(
    initialValue: T,
    {
        deserialize = storageOptions?.deserialize ?? JSON.parse,
        serialize = storageOptions?.serialize ?? JSON.stringify,
        storageKey,
    }: StorageOptions<T> = {},
) => {
    const mmkv = storageOptions?.mmkvInstance ?? new MMKV()

    return {
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
    } as Synchronizer<T>
}
