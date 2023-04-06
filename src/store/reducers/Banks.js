// 委托列表
import { SET_BANKS } from '../actions/Types';
// 成交列表
export const Banks = (state = {
  state: 0,
  list: []
}, action) => {
  // 声明
  const { type, data } = action
  switch (type) {
    case SET_BANKS:
      return data || state
    default:
      return state
  }
}

