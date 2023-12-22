import { createStore } from '../../dist/index.mjs'

const { actions: { setCount }, getState } = createStore({
    count: 0,
})

console.log(getState().count)

setCount(5)

console.log(getState().count)
