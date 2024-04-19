import { MMKV } from 'react-native-mmkv'
import { Synchronizer } from '../types'

const mmkv = new MMKV()
const pendingChange = new Map<string, true>()

type Storage = {
    <T>(initialValue: T, localStorageKey?: string): T
    <T>(initialValue?: T, localStorageKey?: string): T | undefined
}

export const mmkvStorage: Storage = <T>(initialValue: T, localStorageKey?: string) => ({
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

            update(JSON.parse(newValue))
        })
    },
    update: (value, key) => {
        const storageKey = localStorageKey ?? key

        pendingChange.set(storageKey, true)
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
