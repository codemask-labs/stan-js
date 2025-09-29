import { createStorage } from './factory'

/**
 * A Synchronizer implementation using localStorage and mmkv
 * @param initialValue - initial value of the storage
 * @param options.deserialize - function to deserialize the value from storage
 * @param options.serialize - function to serialize the value to storage
 * @param options.storageKey - key to use in storage
 * @see {@link https://codemask-labs.github.io/stan-js/reference/synchronizer/}
 */
export const storage = createStorage()
