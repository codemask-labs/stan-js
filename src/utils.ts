import { ActionKey, Synchronizer } from './types'

export const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export const isSynchronizer = (value: unknown): value is Synchronizer<unknown> =>
    typeof value === 'object' && value !== null && 'subscribe' in value && 'value' in value && 'update' in value && 'getSnapshot' in value

export const optionalArray = <T>(arr: Array<T>, fallback: Array<T>) => arr.length > 0 ? arr : fallback

export const isPromise = <T>(value: unknown): value is Promise<T> => typeof value === 'object' && value !== null && 'then' in value

export const getActionKey = <K>(key: K) => `set${capitalize(String(key))}` as ActionKey<K>
