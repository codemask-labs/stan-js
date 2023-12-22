import { Synchronizer } from '../../../../dist'

const fakeTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const sessionSync = <T>(initialValue: T) => {
    return {
        value: initialValue,
        subscribe: (update, key) => {
            const handleEvent = async (event: StorageEvent) => {
                if (event.storageArea !== sessionStorage || event.key !== key || event.newValue === null) {
                    return
                }

                await fakeTimeout(2000)
                update(JSON.parse(event.newValue))
            }

            window.addEventListener('storage', handleEvent)

            return () => {
                window.removeEventListener('storage', handleEvent)
            }
        },
        update: async (value: T, key) => {
            await fakeTimeout(2000)
            sessionStorage.setItem(key, JSON.stringify(value))
        },
        getSnapshot: async key => {
            const value = sessionStorage.getItem(key)

            await fakeTimeout(2000)

            if (value === null) {
                throw new Error()
            }

            return JSON.parse(value)
        },
    } as Synchronizer<T>
}
