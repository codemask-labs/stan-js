import { Storage, StorageOptions, Synchronizer } from '../types'

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

export const storage: Storage = <T>(
    initialValue: T,
    {
        deserialize = JSON.parse,
        serialize = JSON.stringify,
        storageKey,
    }: StorageOptions<T> = {},
) => ({
    value: initialValue,
    subscribe: (update, key) => {
        const handleEvent = (event: StorageEvent) => {
            if (event.storageArea !== localStorage) {
                return
            }

            if (event.key !== (storageKey ?? key) || event.newValue === null) {
                return
            }

            update(deserialize(event.newValue))
        }

        if (!isLocalStorageAvailable()) {
            return
        }

        window.addEventListener('storage', handleEvent)
    },
    update: (value, key) => ssrSaveStorage.setItem(storageKey ?? key, serialize(value)),
    getSnapshot: key => {
        const value = ssrSaveStorage.getItem(storageKey ?? key)

        if (value === null || value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return deserialize(value)
    },
} as Synchronizer<T>)
