import { describe, it, expect } from 'bun:test'
import { createStore } from '..';

describe('create', () => {
    it('should create store', () => {
        const store = createStore({
            count: 0,
            text: 'test'
        })
    
        expect(store).toBeDefined()
    })
})

describe('state', () => {
    it('should return store state', () => {
        const { getState } = createStore({
            a: 0,
            b: 'test'
        })

        expect(getState()).toEqual({
            a: 0,
            b: 'test'
        })
    })
})

describe('actions', () => {
    it('should update value in store', () => {
        const { getState, actions } = createStore({
            a: 0,
            b: 'test'
        })

        actions.setA(3)
        actions.setB('hmm')

        expect(getState()).toEqual({
            a: 3,
            b: 'hmm'
        })
    })
})

describe('reset', () => {
    it('should reset whole store', () => {
        const initialState = {
            a: 0,
            b: 'test'
        }
        const { getState, actions, reset } = createStore(initialState)

        actions.setA(3)
        actions.setB('hmm')

        expect(getState()).toEqual({
            a: 3,
            b: 'hmm'
        })

        reset()

        expect(getState()).toEqual(initialState)
    })

    it ('should reset part of store', () => {
        const { getState, actions, reset } = createStore({
            a: 0,
            b: 'test'
        })

        actions.setA(3)
        actions.setB('hmm')

        expect(getState()).toEqual({
            a: 3,
            b: 'hmm'
        })

        reset('a')

        expect(getState()).toEqual({
            a: 0,
            b: 'hmm'
        })
    })
})
