import { describe, expect, it } from 'bun:test'
import { equal, isPromise } from '../utils'

describe('utils', () => {
    it('should invoke isPromise and return correct boolean', () => {
        const a = new Promise(resolve => resolve(1))
        const b = 'word'

        expect(isPromise(a)).toBeTruthy()
        expect(isPromise(b)).toBeFalsy()
    })

    it('equal', () => {
        const a = { a: 1, b: 2 }
        const b = { a: 1, b: 2 }
        const c = { a: 1, b: 3 }

        expect(equal(a, b)).toBeTruthy()
        expect(equal(a, c)).toBeFalsy()
        expect(equal(new Date(1000), new Date(10000))).toBeFalsy()
        expect(equal(new Date(1000), new Date(1000))).toBeTruthy()
    })
})
