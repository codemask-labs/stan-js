import mmkv from 'react-native-mmkv'
import { CreateStorageOptions, StorageOptions, Synchronizer } from '../types'

type MMKV_V3 = {
    MMKV: new () => mmkv.MMKV & {
        delete(key: string): void
    }
}

const DefaultMMKV: mmkv.MMKV = 'createMMKV' in mmkv
    ? mmkv.createMMKV()
    : Object.assign(new (mmkv as MMKV_V3).MMKV(), {
        remove(this: mmkv.MMKV, key: string) {
            // @ts-expect-error MMKV v3 delete method
            this.delete(key)
        },
    })

export const createStorage = (storageOptions?: CreateStorageOptions) =>
<T>(
    initialValue: T,
    {
        deserialize = storageOptions?.deserialize ?? JSON.parse,
        serialize = storageOptions?.serialize ?? JSON.stringify,
        storageKey,
    }: StorageOptions<T> = {},
) => {
    const mmkv = storageOptions?.mmkvInstance ?? DefaultMMKV

    return {
        value: initialValue,
        update: (value, key) => {
            const storageKeyToUse = storageKey ?? key

            if (value === undefined) {
                mmkv.remove(storageKeyToUse)

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
