import { createStore } from '../../dist'

const { getState, actions: { setStateA, setStateB }, reset } = createStore({
    stateA: 0,
    stateB: 'A'
})

console.log(getState())

setStateA(10)
setStateB('test')

console.log(getState())

// Reset only one field
reset('stateB')

console.log(getState())

// Reset everything
reset()

console.log(getState())