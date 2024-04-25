import { Synchronizer } from '../types'

export const isLocalStorageAvailable = () => {
    // for SSR
    if (typeof window === 'undefined') {
        return false
    }

    try {
        window.localStorage

        return true
    } catch {
        // if localStorage is disabled
        return false
    }
}
const mapStorage = new Map<string, string>()

const ssrSaveStorage = {
    setItem: (key: string, value: string) => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem(key, value)

            return
        }

        mapStorage.set(key, value)
    },
    getItem: (key: string) => {
        if (isLocalStorageAvailable()) {
            return localStorage.getItem(key)
        }

        return mapStorage.get(key)
    },
}

type StorageOptions<T> = {
    localStorageKey?: string
    deserialize?: (value: string) => T
    serialize?: (value: T) => string
}

type Storage = {
    <T>(initialValue: T, options?: StorageOptions<T>): T
    <T>(initialValue?: T, options?: StorageOptions<T>): T | undefined
}

export const storage: Storage = <T>(
    initialValue: T,
    {
        deserialize = JSON.parse,
        serialize = JSON.stringify,
        localStorageKey,
    }: StorageOptions<T> = {},
) => ({
    value: initialValue,
    subscribe: (update, key) => {
        const handleEvent = (event: StorageEvent) => {
            if (event.storageArea !== localStorage) {
                return
            }

            const storageKey = localStorageKey ?? key

            if (event.key !== storageKey || event.newValue === null) {
                return
            }

            update(deserialize(event.newValue))
        }

        if (!isLocalStorageAvailable()) {
            return
        }

        window.addEventListener('storage', handleEvent)
    },
    update: (value, key) => {
        const storageKey = localStorageKey ?? key

        ssrSaveStorage.setItem(storageKey, serialize(value))
    },
    getSnapshot: key => {
        const storageKey = localStorageKey ?? key
        const value = ssrSaveStorage.getItem(storageKey)

        if (value === null || value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return deserialize(value)
    },
} as Synchronizer<T>)
