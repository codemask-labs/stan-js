import { describe, expect, it } from 'bun:test'
import { Storage } from '../types'
import { createStore } from '../vanilla'

const numAsync = () =>
    ({
        value: 0,
        getSnapshot: () => new Promise(resolve => setTimeout(() => resolve(1), 500)),
        subscribe: () => {},
        update: () => {},
    }) as unknown as number

const undefAsync = () =>
    ({
        value: 0,
        getSnapshot: () => new Promise(resolve => setTimeout(() => resolve(undefined), 500)),
        subscribe: () => {},
        update: () => {},
    }) as unknown as undefined | number

const sync = (snapshot: number) =>
    ({
        value: 0,
        getSnapshot: () => snapshot,
        subscribe: () => {},
        update: () => {},
    }) as unknown as number

const throws: Storage = (initial: number) => ({
    value: initial,
    getSnapshot: () => {
        throw new Error()
    },
    subscribe: () => {},
    update: () => {},
})

describe('asyncSynchronizer', () => {
    const { getState } = createStore({
        asyncValue: numAsync(),
    })

    it('should return initial value', () => {
        expect(getState().asyncValue).toEqual(0)
    })

    it('should return snapshot value', async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
        expect(getState().asyncValue).toEqual(1)
    })

    it('shouldn\'t update value if snapshot is undefined', async () => {
        const { getState } = createStore({
            asyncValue: undefAsync(),
        })

        await new Promise(resolve => setTimeout(resolve, 1100))
        expect(getState().asyncValue).toEqual(0)
    })
})

describe('syncSynchronizer', () => {
    const { getState } = createStore({
        syncValue: sync(1),
    })

    it('should have state from snapshot', () => {
        expect(getState().syncValue).toEqual(1)
    })

    it('shouldn\'t update value when throws', () => {
        const { getState } = createStore({
            syncValue: throws(1),
        })

        expect(getState().syncValue).toEqual(1)
    })
})
