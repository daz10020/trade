import {
  SET_FUNDS, SET_STORE
} from '../actions/Types'

const initialState = {
  Funds: {}
}

export const Funds = (state = initialState.Funds, action) => {
  const { type, data, Funds } = action
  switch (type) {
    case SET_STORE:
      return Funds || state
    // 初始化
    case SET_FUNDS:
      // 更新
      return data
    default:
      return state
  }
}

