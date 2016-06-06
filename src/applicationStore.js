import { combineReducers, createStore } from 'redux'
import reducers from './reducers'

const rootReducer = combineReducers(reducers)
const applicationStore = createStore(rootReducer)

// applicationStore.subscribe(() => {
//   console.log(applicationStore.getState())
// })

export default applicationStore
