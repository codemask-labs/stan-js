import { render, renderHook } from '@testing-library/react'
import { describe, expect, it, jest } from 'bun:test'
import React from 'react'
import { createStore, storage } from '..'

describe('create', () => {
    it('should create store', () => {
        const store = createStore({
            count: 0,
            text: 'test',
        })

        expect(store).toBeDefined()
    })

    it('should throw an error when function is passed', () => {
        expect(() =>
            createStore({
                a: 0,
                // @ts-expect-error
                b: () => {},
            })
        ).toThrow('Function cannot be passed as top level state value')
    })
})

describe('state', () => {
    it('should return store state', () => {
        const { getState } = createStore({
            a: 0,
            b: 'test',
        })

        expect(getState()).toEqual({
            a: 0,
            b: 'test',
        })
    })
})

describe('actions', () => {
    it('should update value in store', () => {
        const { getState, actions } = createStore({
            a: 0,
            b: 'test',
            c: storage(0),
        })

        actions.setA(3)
        actions.setB('hmm')
        actions.setC(prev => prev + 1)

        const { a, b, c } = getState()

        expect(a).toEqual(3)
        expect(b).toEqual('hmm')
        expect(c).toEqual(1)
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

        const { result: { current: { actions, state } } } = renderHook(() => useStore())

        expect(state).toBeDefined()
        expect(state.a).toEqual(0)
        expect(state.b).toEqual('test')
        expect(actions).toBeDefined()
        expect(actions).toHaveProperty('setA')
        expect(actions).toHaveProperty('setB')
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

    it('should return partial state', () => {
        const { useStore } = createStore({
            a: 0,
            b: 'test',
        })

        const { result: { current: { state } } } = renderHook(() => useStore('a'))

        expect(state).toStrictEqual({ a: 0 })
    })
})

describe('proxy', () => {
    it.only('shouldn\'t subscribe to state changes', () => {
        const { useStore } = createStore({
            counter: 0,
        })

        const callback = jest.fn()

        const RerenderCounter = () => {
            const { actions } = useStore()

            callback()

            actions.setCounter(1)
            setTimeout(() => {
                actions.setCounter(2)
            })

            return null
        }

        render(<RerenderCounter />)
        expect(callback).toHaveBeenCalledTimes(2)
    })
})
