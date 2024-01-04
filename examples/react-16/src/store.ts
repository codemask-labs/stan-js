import { createStore, storage } from '../../../dist'

export const { useStore } = createStore({
    counter: 0,
    persisted: storage(0),
})
