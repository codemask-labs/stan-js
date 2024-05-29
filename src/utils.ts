import { ActionKey, Synchronizer } from './types'

export const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export const isSynchronizer = (value: unknown): value is Synchronizer<unknown> =>
    typeof value === 'object' && value !== null && 'subscribe' in value && 'value' in value && 'update' in value && 'getSnapshot' in value

export const optionalArray = <T>(arr: Array<T>, fallback: Array<T>) => arr.length > 0 ? arr : fallback

export const isPromise = <T>(value: unknown): value is Promise<T> => typeof value === 'object' && value !== null && 'then' in value

export const getActionKey = <K>(key: K) => `set${capitalize(String(key))}` as ActionKey<K>

export const keyInObject = <T extends object>(key: PropertyKey, obj: T): key is keyof T => key in obj

export const equal = <T>(a: T, b: T) => {
    if (Object.is(a, b)) {
        return true
    }

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
    }

    if (
        typeof a !== 'object'
        || a === null
        || typeof b !== 'object'
        || b === null
    ) {
        return false
    }

    const keysA = Object.keys(a) as Array<keyof T>

    if (keysA.length !== Object.keys(b).length) {
        return false
    }

    return keysA.every(key => Object.is(a[key], b[key]) && Object.prototype.hasOwnProperty.call(b, key))
}
