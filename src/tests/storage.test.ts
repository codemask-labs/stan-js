/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { describe, expect, it, spyOn } from 'bun:test'
import { isLocalStorageAvailable, storage } from '../storage'

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
        const { update, getSnapshot } = storage(1, 'key')

        update(2, 'key')

        expect(getSnapshot('key')).toEqual(2)
    })
})
