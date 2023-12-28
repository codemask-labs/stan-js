import { isPromise } from '../utils'

describe('utils', () => {
    it('should invoke isPromise and return correct boolean', () => {
        const a = new Promise(resolve => resolve(1))
        const b = 'word'

        expect(isPromise(a)).toBeTruthy()
        expect(isPromise(b)).toBeFalsy()
    })
})
