import { describe, expect, it, jest, spyOn } from 'bun:test'
import { storage } from '../storage'
import { isLocalStorageAvailable } from '../storage/storage'
import { Synchronizer } from '../types'

const windowStub = spyOn(window, 'window')
const originalWindow = { ...window }

describe('isLocalStorageAvailable', () => {
    it('should return false', () => {
        // @ts-ignore
        windowStub.mockImplementationOnce(() => undefined)

        expect(isLocalStorageAvailable()).toBeFalsy()
    })
})

describe('storage', () => {
    it('should return an object with keys', () => {
        const returnedValue = storage()

        expect(returnedValue).toHaveProperty('value')
        expect(returnedValue).toHaveProperty('subscribe')
        expect(returnedValue).toHaveProperty('update')
        expect(returnedValue).toHaveProperty('getSnapshot')
    })

    it('should update value', () => {
        const { update, getSnapshot } = storage(1, { storageKey: 'key' }) as unknown as Synchronizer<number>

        update(2, 'key')

        expect(getSnapshot('key')).toEqual(2)
    })

    it('should serialize date as UNIX timestamp and deserialize it correctly', () => {
        const { update, getSnapshot } = storage(new Date(), {
            serialize: value => value.getTime().toString(),
            deserialize: value => new Date(Number(value)),
        }) as unknown as Synchronizer<Date>

        update(new Date('2020-01-02'), 'date')
        expect(localStorage.getItem('date')).toBe('1577923200000')

        localStorage.setItem('date', '1641081600000')
        expect(getSnapshot('date')).toEqual(new Date('2022-01-02'))
    })
})

describe('disabled localStorage', () => {
    it('should work', () => {
        windowStub.mockImplementation(
            (() => ({
                localStorage: undefined,
            })) as never,
        )
        const { getSnapshot, update, subscribe } = storage(1, { storageKey: 'key' }) as unknown as Synchronizer<number>

        subscribe?.(() => {}, 'key')
        expect(window).toBeDefined()
        expect(isLocalStorageAvailable()).toBeFalsy()

        update(2, 'key')

        expect(getSnapshot('key')).toEqual(2)
    })
})

describe('SSR', () => {
    it('should work', () => {
        windowStub.mockImplementation((() => undefined) as never)
        const { getSnapshot, update } = storage(1, { storageKey: 'ssr' }) as unknown as Synchronizer<number>

        expect(typeof window).toBe('undefined')
        expect(isLocalStorageAvailable()).toBeFalsy()

        update(2, 'key')

        expect(getSnapshot('key')).toEqual(2)
    })
})

describe('storage change', () => {
    it('should trigger update on change', () => {
        windowStub.mockImplementation((() => originalWindow) as never)

        const { subscribe } = storage(1, { storageKey: 'key' }) as unknown as Synchronizer<number>

        const callback = jest.fn()

        subscribe?.(callback, 'key')

        expect(callback).toHaveBeenCalledTimes(0)

        const storageEvent = new StorageEvent('storage', { key: 'key', newValue: '2', storageArea: window.localStorage })

        window.dispatchEvent(storageEvent)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not trigger update on sessionStorage change', () => {
        const { subscribe } = storage(1, { storageKey: 'key' }) as unknown as Synchronizer<number>

        const callback = jest.fn()

        subscribe?.(callback, 'key')

        expect(callback).toHaveBeenCalledTimes(0)

        const storageEvent = new StorageEvent('storage', { key: 'key', newValue: '2', storageArea: window.sessionStorage })

        window.dispatchEvent(storageEvent)

        expect(callback).toHaveBeenCalledTimes(0)
    })

    it('should not trigger update on different key change', () => {
        const { subscribe } = storage(1, { storageKey: 'key' }) as unknown as Synchronizer<number>

        const callback = jest.fn()

        subscribe?.(callback, 'key')

        expect(callback).toHaveBeenCalledTimes(0)

        const storageEvent = new StorageEvent('storage', { key: 'another', newValue: '2', storageArea: window.localStorage })

        window.dispatchEvent(storageEvent)

        expect(callback).toHaveBeenCalledTimes(0)
    })
})
