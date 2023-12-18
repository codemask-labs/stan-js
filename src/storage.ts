import { Synchronizer } from './createStore'

export function storage <T>(initialValue: T, localStorageKey?: string): Synchronizer<T>
export function storage <T>(initialValue?: T, localStorageKey?: string): Synchronizer<T | undefined>
export function storage <T>(initialValue: T, localStorageKey?: string) {
    return {
        value: initialValue,
        subscribe: (update, key) => {
            const handleEvent = (event: StorageEvent) => {
                const storageKey = localStorageKey ?? key

                if (event.key !== storageKey || event.newValue === null) {
                    return
                }

                update(JSON.parse(event.newValue))
            }

            window.addEventListener('storage', handleEvent)

            return () => {
                window.removeEventListener('storage', handleEvent)
            }
        },
        update: (value: T, key) => {
            const storageKey = localStorageKey ?? key

            localStorage.setItem(storageKey, JSON.stringify(value))
        },
        getSnapshot: key => {
            const storageKey = localStorageKey ?? key
            const value = localStorage.getItem(storageKey)

            if (value === null) {
                return null
            }

            return JSON.parse(value)
        }
    } as Synchronizer<T>
}
