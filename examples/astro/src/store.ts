import { createStore } from 'stan-js'

export const { useStore, getState, actions, effect } = createStore({
    counter: 0,
})
