import { describe, expect, it, spyOn } from 'bun:test'
import { storage } from '../storage'
import { isLocalStorageAvailable } from '../storage/storage'
import { Synchronizer } from '../types'

describe('isLocalStorageAvailable', () => {
    const windowStub = spyOn(window, 'window')

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
