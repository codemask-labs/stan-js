import { Equal, Expect } from 'type-testing'
import { createStore } from '../createStore'
import { storage } from '../storage'

const { useStore, getState, actions, reset } = createStore({
    counter: 0,
    user: storage('john'),
})

type ExpectedStateKeys = 'counter' | 'user'

type ExpectedStateValues = {
    counter: number
    user: string
}

type ExpectedActions = {
    setCounter: (value: number | ((prevState: number) => number)) => void
    setUser: (value: string | ((prevState: string) => string)) => void
}

type ResetKeys = Parameters<typeof reset>[number]
export type ExpectedResetTest = Expect<Equal<ResetKeys, ExpectedStateKeys>>

type Actions = typeof actions
export type ExpectedActionsTest = Expect<Equal<Actions, ExpectedActions>>

type State = ReturnType<typeof getState>
export type ExpectedStateTest = Expect<Equal<State, ExpectedStateValues>>

type UseStoreActions = ReturnType<typeof useStore>['actions']
export type ExpectedUseStoreActionsTest = Expect<Equal<UseStoreActions, ExpectedActions>>

type UseStoreState = ReturnType<typeof useStore>['state']
export type ExpectedUseStoreStateTest = Expect<Equal<UseStoreState, ExpectedStateValues>>
