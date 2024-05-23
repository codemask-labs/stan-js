import { render, renderHook } from '@testing-library/react'
import { describe, expect, it, jest } from 'bun:test'
import React from 'react'
import { createStore } from '../createStore'
import { storage } from '../storage'

describe('create', () => {
    it('should create store', () => {
        const store = createStore({
            count: 0,
            text: 'test',
        })

        expect(store).toBeDefined()
    })
})

describe('state', () => {
    it('should return store state', () => {
        const { getState } = createStore({
            a: 0,
            b: 'test',
            c: ({ a }) => a + 1,
        })

        expect(getState()).toEqual({
            a: 0,
            b: 'test',
            c: 1,
        })
    })
})

describe('actions', () => {
    it('should update value in store', () => {
        const { getState, actions } = createStore({
            a: 0,
            b: 'test',
            c: storage(0),
            d: ({ a }) => a + 1,
        })

        actions.setA(3)
        actions.setB('hmm')
        actions.setC(prev => prev + 1)

        const { a, b, c, d } = getState()

        expect(a).toEqual(3)
        expect(b).toEqual('hmm')
        expect(c).toEqual(1)
        expect(d).toEqual(4)
        expect(window.localStorage.getItem('c')).toEqual('1')
    })
})

describe('reset', () => {
    it('should reset whole store', () => {
        const initialState = {
            a: 0,
            b: 'test',
        }
        const { getState, actions, reset } = createStore(initialState)

        actions.setA(3)
        actions.setB('hmm')

        expect(getState()).toEqual({
            a: 3,
            b: 'hmm',
        })

        reset()

        expect(getState()).toEqual(initialState)
    })

    it('should reset part of store', () => {
        const { getState, actions, reset } = createStore({
            a: 0,
            b: 'test',
        })

        actions.setA(3)
        actions.setB('hmm')

        expect(getState()).toEqual({
            a: 3,
            b: 'hmm',
        })

        reset('a')

        expect(getState()).toEqual({
            a: 0,
            b: 'hmm',
        })
    })
})

describe('useStore', () => {
    it('should return state and actions', () => {
        const { useStore } = createStore({
            a: 0,
            b: 'test',
        })

        const { result: { current: { a, b, setA, setB } } } = renderHook(() => useStore())

        expect(a).toEqual(0)
        expect(b).toEqual('test')
        expect(setA).toBeDefined()
        expect(setB).toBeDefined()
    })

    it('should return undefined when invalid value is accessed', () => {
        const { useStore } = createStore({})

        // @ts-expect-error
        const { result: { current: { a } } } = renderHook(() => useStore())

        expect(a).toEqual(undefined)
    })

    it('should return state and actions from storage', async () => {
        const { actions, getState } = createStore({
            a: storage(0),
            b: storage('test'),
            c: new Promise(resolve => resolve(5)),
        })
        const state = getState()

        expect(state).toBeDefined()
        expect(state.a).toEqual(0)
        expect(state.b).toEqual('test')
        expect(await state.c).toEqual(5)
        expect(actions).toBeDefined()
        expect(actions).toHaveProperty('setA')
        expect(actions).toHaveProperty('setB')
    })
})

describe('proxy', () => {
    it('shouldn\'t subscribe to state changes', () => {
        const { useStore } = createStore({
            counter: 0,
        })

        const callback = jest.fn()

        const RerenderCounter = () => {
            const { setCounter } = useStore()

            callback()

            setCounter(1)
            setTimeout(() => {
                setCounter(2)
            })

            return null
        }

        render(<RerenderCounter />)
        expect(callback).toHaveBeenCalledTimes(1)
    })
})

describe('effect', () => {
    it('should run effect', () => {
        const { effect, actions } = createStore({
            a: 0,
            b: 0,
            c: ({ a }) => a + 1,
        })

        const callback = jest.fn()
        const dispose = effect(({ a }) => {
            callback(a)
        })
        const computedCallback = jest.fn()
        const computedDispose = effect(({ c }) => computedCallback(c))

        expect(callback).toHaveBeenCalledTimes(1)
        expect(computedCallback).toHaveBeenCalledWith(1)

        actions.setA(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)
        expect(computedCallback).toHaveBeenCalledWith(2)

        actions.setB(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)

        dispose()
        computedDispose()

        actions.setA(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)
        expect(computedCallback).toHaveBeenCalledTimes(2)
    })

    it('should run effect on every store change', () => {
        const { effect, actions } = createStore({
            a: 0,
            b: 0,
        })

        const callback = jest.fn()
        const dispose = effect(() => {
            callback()
        })

        expect(callback).toHaveBeenCalledTimes(1)

        actions.setA(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)

        dispose()

        actions.setA(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)
    })
})

describe('useStoreEffect', () => {
    it('should run effect', () => {
        const { useStoreEffect, actions } = createStore({
            a: 0,
            b: 0,
        })

        const callback = jest.fn()

        renderHook(() =>
            useStoreEffect(({ a }) => {
                callback(a)
            })
        )

        expect(callback).toHaveBeenCalledTimes(1)

        actions.setA(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)

        actions.setB(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)
    })
})
