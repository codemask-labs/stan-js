import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import React from 'react'
import { createStore } from '../createStore'

describe('hydrate', () => {
    it('should replace store\'s state', async () => {
        const { useStore, HydrateStore, actions, reset, getState } = createStore({
            userName: '',
        })
        const hydratedUserName = 'Johnny Test'
        const rerenderUserName = 'Test Johnny'

        const App = () => (
            <HydrateStore hydrateState={{ userName: hydratedUserName }}>
                <User />
            </HydrateStore>
        )

        const User = () => {
            const { state } = useStore('userName')

            return <div>{state.userName}</div>
        }

        const { findByText } = render(<App />)

        expect(async () => findByText(hydratedUserName)).not.toThrow()

        actions.setUserName(rerenderUserName)

        expect(getState().userName).toBe(rerenderUserName)

        reset('userName')

        expect(getState().userName).toBe(hydratedUserName)
    })
})
