import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'bun:test'
import React, { Fragment, FunctionComponent } from 'react'
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
            <Fragment>
                <User id="1" />
                <StoreProvider initialValue={{ userName: 'Johnny Test' }}>
                    <User id="2" />
                    <StoreProvider initialValue={{ userName: 'Test Johnny' }}>
                        <User id="3" />
                    </StoreProvider>
                </StoreProvider>
            </Fragment>
        )

        render(<App />)

        expect(screen.getByTestId('1').innerText).toBe('Tonny Jest')
        expect(screen.getByTestId('2').innerText).toBe('Johnny Test')
        expect(screen.getByTestId('3').innerText).toBe('Test Johnny')
    })

    it('should override only part of state', async () => {
        const { StoreProvider, useScopedStore } = createScopedStore({
            firstName: 'John',
            lastName: 'Smith',
        })

        const User = () => {
            const { useStore } = useScopedStore()
            const { firstName, lastName } = useStore()

            return <p>{firstName} {lastName}</p>
        }

        const App = () => (
            <StoreProvider initialValue={{ lastName: 'Doe' }}>
                <User />
            </StoreProvider>
        )

        render(<App />)

        expect(screen.getByText('John Doe')).toBeDefined()
    })

    it('should inject scoped store when using HOC', () => {
        const { withStore, useScopedStore } = createScopedStore({
            firstName: 'John',
            lastName: 'Smith',
        })

        const User = () => {
            const { useStore } = useScopedStore()
            const { firstName, lastName } = useStore()

            return <p>{firstName} {lastName}</p>
        }
        const UserWithStore = withStore(User, { lastName: 'Doe' })

        render(<UserWithStore />)
        expect(screen.getByText('John Doe')).toBeDefined()
    })
})
