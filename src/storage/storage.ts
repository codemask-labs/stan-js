import { Storage, StorageOptions, Synchronizer } from '../types'

export const isLocalStorageAvailable = () => {
    // for SSR
    if (typeof window === 'undefined') {
        return false
    }

    try {
        window.localStorage.length

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
    removeItem: (key: string) => {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem(key)

            return
        }

        mapStorage.delete(key)
    },
}

/**
 * A Synchronizer implementation using localStorage and mmkv
 * @param initialValue - initial value of the storage
 * @param options.deserialize - function to deserialize the value from storage
 * @param options.serialize - function to serialize the value to storage
 * @param options.storageKey - key to use in storage
 * @see {@link https://github.com/codemask-labs/stan-js#Synchronizer}
 */
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
    update: (value, key) => {
        if (value === undefined) {
            ssrSaveStorage.removeItem(storageKey ?? key)

            return
        }

        ssrSaveStorage.setItem(storageKey ?? key, serialize(value))
    },
    getSnapshot: key => {
        const value = ssrSaveStorage.getItem(storageKey ?? key)

        if (value === null || value === undefined) {
            // Value is not in storage
            throw new Error()
        }

        return deserialize(value)
    },
} as Synchronizer<T>)
