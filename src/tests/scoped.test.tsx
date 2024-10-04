import { cleanup, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, jest } from 'bun:test'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { createScopedStore } from '../scoped'

describe('scoped', () => {
    afterEach(cleanup)

    it('should scope store to given subtree', async () => {
        const { StoreProvider, useScopedStore } = createScopedStore({
            userName: 'Tonny Jest',
        })

        const User: FunctionComponent<{ id: string }> = ({ id }) => {
            const { useStore } = useScopedStore()
            const { userName } = useStore()

            return <p data-testid={id}>{userName}</p>
        }

        const App = () => (
            <React.Fragment>
                <User id="1" />
                <StoreProvider initialValue={{ userName: 'Johnny Test' }}>
                    <User id="2" />
                    <StoreProvider initialValue={{ userName: 'Test Johnny' }}>
                        <User id="3" />
                    </StoreProvider>
                </StoreProvider>
            </React.Fragment>
        )

        render(<App />)

        expect(screen.getByTestId('1').innerText).toBe('Tonny Jest')
        expect(screen.getByTestId('2').innerText).toBe('Johnny Test')
        expect(screen.getByTestId('3').innerText).toBe('Test Johnny')
    })

    it('should override only part of state', async () => {
        const { StoreProvider, useStore } = createScopedStore({
            firstName: 'John',
            lastName: 'Smith',
            get name() {
                return `${this.firstName} ${this.lastName}`
            },
        })

        const User = () => {
            const { firstName, lastName, name } = useStore()

            return <p>{firstName} {lastName} ({name})</p>
        }

        const App = () => (
            <StoreProvider initialValue={{ lastName: 'Doe' }}>
                <User />
            </StoreProvider>
        )

        render(<App />)

        expect(screen.getByText('John Doe (John Doe)')).toBeDefined()
    })

    it('should inject scoped store when using HOC', () => {
        const { withStore, useStore } = createScopedStore({
            firstName: 'John',
            lastName: 'Smith',
        })

        const User = () => {
            const { firstName, lastName } = useStore()

            return <p>{firstName} {lastName}</p>
        }
        const UserWithStore = withStore(User, { lastName: 'Doe' })

        render(<UserWithStore />)
        expect(screen.getByText('John Doe')).toBeDefined()
    })

    it('scoped useStoreEffect', () => {
        const { useStoreEffect, useScopedStore } = createScopedStore({
            a: 0,
            b: 0,
        })

        const callback = jest.fn()

        renderHook(() =>
            useStoreEffect(({ a }) => {
                callback(a)
            })
        )

        const { result: { current: { actions } } } = renderHook(() => useScopedStore())

        expect(callback).toHaveBeenCalledTimes(1)

        actions.setA(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)

        actions.setB(prev => prev + 1)

        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should update state on initial value change', () => {
        const { StoreProvider, useStore } = createScopedStore({
            test: '',
        })

        const User = () => {
            const { test } = useStore()

            return <p>{test}</p>
        }

        const App = () => {
            const isRendered = useRef(false)

            useEffect(() => {
                isRendered.current = true
            }, [])

            return (
                <StoreProvider initialValue={{ test: isRendered.current ? 'Next value' : 'Initial value' }}>
                    <User />
                </StoreProvider>
            )
        }

        const { rerender } = render(<App />)
        expect(screen.getByText('Initial value')).toBeDefined()

        rerender(<App />)
        expect(screen.getByText('Next value')).toBeDefined()
    })
})
