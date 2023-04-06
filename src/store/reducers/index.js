import { combineReducers } from 'redux'
import { userList } from './user'
import { Funds } from './funds'
import { Entrustment } from './Entrustment'
import { Deal } from './Deal'
import { Banks } from './Banks'
import { Positions } from './Positions'
// import { Instrument } from './Instrument'

export default _ => combineReducers({
  Banks,
  userList,
  Deal,
  Entrustment,
  Positions,
  // Instrument,
  Funds
})
