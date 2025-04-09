import { describe, expect, it, jest, Mock, spyOn } from 'bun:test'
import { storage } from '../storage'
import { isLocalStorageAvailable } from '../storage/storage'
import { Synchronizer } from '../types'

const windowStub = spyOn(window, 'window') as Mock<() => undefined | Window>
const originalWindow = {
    ...window,
    dispatchEvent: window.dispatchEvent,
    addEventListener: window.addEventListener,
    localStorage: window.localStorage,
} as unknown as Window

const getStorage = () => storage(1, { storageKey: 'key' }) as unknown as Synchronizer<number | undefined>

describe('isLocalStorageAvailable', () => {
    it('should return false', () => {
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
        const { update, getSnapshot } = getStorage()

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

    it('should remove value from storage', () => {
        type UserData = {
            username: string
            accessToken: string
            refreshToken: string
        }
        const userData = {
            username: 'test',
            accessToken: 'access',
            refreshToken: 'refresh',
        }

        const { update, getSnapshot } = storage<UserData | undefined>(undefined, {
            storageKey: 'user',
        }) as unknown as Synchronizer<UserData | undefined>

        update(userData, 'user')
        expect(getSnapshot('user')).toEqual(userData)

        update(undefined, 'user')
        expect(() => getSnapshot('user')).toThrow()
    })
})

describe('disabled localStorage', () => {
    it('should work', () => {
        windowStub.mockImplementation(
            (() => ({
                localStorage: undefined,
            })) as never,
        )
        const { getSnapshot, update, subscribe } = getStorage()

        subscribe?.(() => {}, 'key')
        expect(window).toBeDefined()
        expect(isLocalStorageAvailable()).toBeFalsy()

        update(2, 'key')

        expect(getSnapshot('key')).toEqual(2)
    })
})

describe('SSR', () => {
    it('should work', () => {
        windowStub.mockImplementation(() => undefined)
        const { getSnapshot, update } = getStorage()

        expect(typeof window).toBe('undefined')
        expect(isLocalStorageAvailable()).toBeFalsy()

        update(2, 'key')

        expect(getSnapshot('key')).toEqual(2)

        update(undefined, 'key')

        expect(() => getSnapshot('key')).toThrowError()
    })
})

describe('storage change', () => {
    it('should trigger update on change', () => {
        windowStub.mockImplementation(() => originalWindow)

        const { subscribe } = getStorage()

        const callback = jest.fn()

        subscribe?.(callback, 'key')

        expect(callback).toHaveBeenCalledTimes(0)

        const storageEvent = new StorageEvent('storage', { key: 'key', newValue: '2', storageArea: window.localStorage })

        window.dispatchEvent(storageEvent)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not trigger update on sessionStorage change', () => {
        const { subscribe } = getStorage()

        const callback = jest.fn()

        subscribe?.(callback, 'key')

        expect(callback).toHaveBeenCalledTimes(0)

        const storageEvent = new StorageEvent('storage', { key: 'key', newValue: '2', storageArea: window.sessionStorage })

        window.dispatchEvent(storageEvent)

        expect(callback).toHaveBeenCalledTimes(0)
    })

    it('should not trigger update on different key change', () => {
        const { subscribe } = getStorage()

        const callback = jest.fn()

        subscribe?.(callback, 'key')

        expect(callback).toHaveBeenCalledTimes(0)

        const storageEvent = new StorageEvent('storage', { key: 'another', newValue: '2', storageArea: window.localStorage })

        window.dispatchEvent(storageEvent)

        expect(callback).toHaveBeenCalledTimes(0)
    })
})
