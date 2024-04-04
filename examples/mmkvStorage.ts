import { Synchronizer } from '@codemaskinc/store'
import { MMKV } from 'react-native-mmkv'

const mmkv = new MMKV()

type Storage = {
    <T>(initialValue: T, localStorageKey?: string): T
    <T>(initialValue?: T, localStorageKey?: string): T | undefined
}

export const mmkvStorage: Storage = <T>(initialValue: T, localStorageKey?: string) => ({
    value: initialValue,
    subscribe: (update, key) => {
        mmkv.addOnValueChangedListener((changedKey) => {
            const storageKey = localStorageKey ?? key

            if (changedKey !== storageKey) {
                return
            }

            const newValue = mmkv.getString(changedKey)

            if (newValue === undefined) {
                return
            }

            update(JSON.parse(newValue))
        })
    },
    update: (value, key) => {
        const storageKey = localStorageKey ?? key

        mmkv.set(storageKey, JSON.stringify(value))
    },
    getSnapshot: key => {
        const storageKey = localStorageKey ?? key
        const value = mmkv.getString(storageKey)

        if (value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return JSON.parse(value)
    },
} as Synchronizer<T>)
