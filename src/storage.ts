import { Synchronizer } from './types'

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

type Storage = {
    <T>(initialValue: T, localStorageKey?: string): T
    <T>(initialValue?: T, localStorageKey?: string): T | undefined
}

export const storage: Storage = <T>(initialValue: T, localStorageKey?: string) => ({
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

            update(JSON.parse(event.newValue))
        }

        if (!isLocalStorageAvailable()) {
            return
        }

        window.addEventListener('storage', handleEvent)
    },
    update: (value: T, key) => {
        const storageKey = localStorageKey ?? key

        ssrSaveStorage.setItem(storageKey, JSON.stringify(value))
    },
    getSnapshot: key => {
        const storageKey = localStorageKey ?? key
        const value = ssrSaveStorage.getItem(storageKey)

        if (value === null || value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return JSON.parse(value)
    },
} as Synchronizer<T>)
