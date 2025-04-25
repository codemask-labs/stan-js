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

    it('should throw an error when function is passed', () => {
        expect(() =>
            createStore({
                a: 0,
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
            get c() {
                return this.a + 1
            },
        })

        expect(getState()).toEqual({
            a: 0,
            b: 'test',
            c: 1,
        })
    })

    it('should failed with invalid computed property', () => {
        const { getState } = createStore({
            a: 0,
            get b(): undefined {
                // @ts-expect-error
                return this.c
            },
        })

        expect(getState().b).toEqual(undefined)
    })

    it('should work when computing state from synchronizer', () => {
        const store = createStore({
            counter: storage(2),
            get parity() {
                return this.counter % 2 === 0 ? 'even' : 'odd'
            },
        })

        expect(store.getState().counter).toEqual(2)
        expect(store.getState().parity).toEqual('even')
    })
})

describe('actions', () => {
    it('should update value in store', () => {
        const { getState, actions } = createStore({
            a: 0,
            b: 'test',
            c: storage(0),
            get d() {
                return this.a + 1
            },
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

    it('shouldn\'t trigger update for the same value', () => {
        const { effect, actions } = createStore({
            counter: 0,
            get doubleCounter() {
                return this.counter * 2
            },
        })

        const callback = jest.fn()

        effect(({ counter, doubleCounter }) => callback(counter, doubleCounter))

        expect(callback).toHaveBeenCalledTimes(1)

        actions.setCounter(0)

        expect(callback).toHaveBeenCalledTimes(1)

        actions.setCounter(prev => prev)

        expect(callback).toHaveBeenCalledTimes(1)
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

    it('should allow resetting when computed in store', () => {
        const store = createStore({
            counter: 2,
            get parity() {
                return this.counter % 2 === 0 ? 'even' : 'odd'
            },
        })

        store.actions.setCounter(3)
        store.reset()

        expect(store.getState().counter).toEqual(2)
    })

    it('should batch updates when resetting', () => {
        const { effect, actions, reset } = createStore({
            a: 0,
            b: 0,
        })

        const callback = jest.fn()

        effect(({ a, b }) => callback(a, b))

        expect(callback).toHaveBeenCalledTimes(1)

        actions.setA(1)
        actions.setB(2)

        expect(callback).toHaveBeenCalledTimes(3)

        reset()

        expect(callback).toHaveBeenCalledTimes(4)
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
            get c() {
                return this.a + 1
            },
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

    it('should not re-calculate computed state when not needed', () => {
        const store = createStore({
            counter: 2,
            get parity() {
                return this.counter % 2 === 0 ? 'even' : 'odd'
            },
        })
        const callback = jest.fn()

        store.effect(({ parity }) => callback(parity))

        store.actions.setCounter(2)
        store.actions.setCounter(2)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should deduplicate dependency listeners', () => {
        const store = createStore({
            firstName: 'John',
            get name() {
                return `${this.firstName} ${this.firstName} ${this.firstName} ${this.firstName} ${this.firstName}`
            },
        })

        const callback = jest.fn()
        store.effect(({ name }) => callback(name))
        store.actions.setFirstName('Andrzej')

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

describe('batch', () => {
    it('should batch updates', () => {
        const { effect, actions, batchUpdates } = createStore({
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        })
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const callback3 = jest.fn()

        effect(({ a, b, c }) => callback1())
        effect(({ a, b, c }) => callback2())
        effect(({ c, d }) => callback3())

        batchUpdates(() => {
            actions.setA(1)
            actions.setB(2)
            actions.setC(3)
            actions.setD(4)
        })

        // All effects should be called only once (beside initial call)
        expect(callback1).toBeCalledTimes(2)
        expect(callback2).toBeCalledTimes(2)
        expect(callback3).toBeCalledTimes(2)

        actions.setB(0)
        actions.setC(0)

        // First two effect should be called 2 more times { b, c }, third 1 more time { c }
        expect(callback1).toBeCalledTimes(4)
        expect(callback2).toBeCalledTimes(4)
        expect(callback3).toBeCalledTimes(3)
    })
})

describe('storage + computed', () => {
    it('storage should work with computed', () => {
        const { getState } = createStore({
            test: [1],
            get computedTest() {
                return this.test.at(0)
            },
        })

        expect(getState().computedTest).toEqual(1)
    })
})

describe('devtools', () => {
    createStore({
        test: 0,
    })
    // @ts-expect-error
    const stores = globalThis['__stan-js__']
    const { store, listen, updateStore } = stores.at(-1)

    expect(store).toBeDefined()
    expect(listen).toBeDefined()
    expect(updateStore).toBeDefined()
    updateStore({ test: 1 })

    expect(store.test).toEqual(1)
})

describe('hydration', () => {
    it('should hydrate state once', async () => {
        const store1 = createStore({ name: 'John' })
        const store2 = createStore({
            count: 0,
            get doubleCount() {
                return this.count * 2
            },
        })

        renderHook(() => store1.useHydrateState({ name: 'Jane' }))
        const { rerender } = renderHook(() => store2.useHydrateState({ count: 10 }))

        expect(store1.getState().name).toBe('Jane')
        expect(store2.getState().count).toBe(10)
        expect(store2.getState().doubleCount).toBe(20)

        store2.actions.setCount(20)
        rerender()

        expect(store2.getState().count).toBe(20)
    })
})

describe('custom actions', () => {
    it('custom actions should be batched', () => {
        const { getState, effect, actions } = createStore(
            {
                firstName: 'John',
                lastName: 'Doe',
            },
            ({ actions }) => ({
                setUser: (firstName: string, lastName: string) => {
                    actions.setFirstName(firstName)
                    actions.setLastName(lastName)
                },
            }),
        )

        const callback = jest.fn()

        effect(({ firstName, lastName }) => callback(firstName, lastName))

        expect(callback).toHaveBeenCalledTimes(1)

        expect(getState().firstName).toBe('John')
        expect(getState().lastName).toBe('Doe')

        actions.setUser('Jane', 'Anderson')

        expect(getState().firstName).toBe('Jane')
        expect(getState().lastName).toBe('Anderson')

        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('custom actions can\'t have the same key as state or actions', () => {
        expect(() =>
            createStore(
                {
                    name: 'John',
                },
                ({ actions }) => ({
                    setName: actions.setName,
                }),
            )
        ).toThrow()
    })
})
