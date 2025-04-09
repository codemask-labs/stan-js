import { Equal, Expect } from 'type-testing'
import { createStore } from '../createStore'
import { storage } from '../storage'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { useStore, getState, actions, reset } = createStore({
    counter: 0,
    user: storage('john'),
    nullable: null as string | null,
})

type ExpectedStateKeys = 'counter' | 'user' | 'nullable'

type ExpectedStateValues = {
    counter: number
    user: string
    nullable: string | null
}

type ExpectedActions = {
    setCounter: (value: number | ((prevState: number) => number)) => void
    setUser: (value: string | ((prevState: string) => string)) => void
    setNullable: (value: string | null | ((prevState: string | null) => string | null)) => void
}

type ResetKeys = Parameters<typeof reset>[number]
export type ExpectedResetTest = Expect<Equal<ResetKeys, ExpectedStateKeys>>

type Actions = typeof actions
export type ExpectedActionsTest = Expect<Equal<Actions, ExpectedActions>>

type State = ReturnType<typeof getState>
export type ExpectedStateTest = Expect<Equal<State, ExpectedStateValues>>

type UseStoreReturn = ReturnType<typeof useStore>
export type ExpectedUseStoreTest = Expect<Equal<UseStoreReturn, ExpectedStateValues & ExpectedActions>>
