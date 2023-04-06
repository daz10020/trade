import {
  SET_STORE,
  SET_USER_ITEM, SET_USER_LIST, DEL_USER_ITEM,
  SET_DEAL_LIST,
  SET_DEAL_ITEM,
  SET_ENTRUST_LIST,
  SET_ENTRUST_ITEM,
  SET_POS_LIST,
  SET_POS_ITEM,
  SET_FUNDS,
  SET_INSTRUMENT_LIST,
  SET_INSTRUMENT_TEMP_LIST,
  SET_BANKS
} from '../actions/Types'

// 更新全局信息
export const setStore = data => ({
  type: SET_STORE,
  ...data
})

// 单条用户信息更新
export const setUserItemActions = userData => ({
  type: SET_USER_ITEM,
  ...userData
})

// 单条用户信息更新
export const delUserItemActions = userData => ({
  type: DEL_USER_ITEM,
  ...userData
})

// 用户列表更新
export const setUserListActions = list => ({
  type: SET_USER_LIST,
  list
})

// 更新成交单项
export const setDealItemActions = data => ({
  type: SET_DEAL_ITEM,
  data
})
// 更新成交列表
export const setDealsActions = list => ({
  type: SET_DEAL_LIST,
  list
})
// 更新委托单项
export const setEntrustItemActions = data => ({
  type: SET_ENTRUST_ITEM,
  data
})
// 更新委托列表
export const setEntrustsActions = list => ({
  type: SET_ENTRUST_LIST,
  list
})
// 更新持仓单项
export const setPositionsItemActions = data => ({
  type: SET_POS_ITEM,
  data
})
// 更新持仓列表
export const setPositionsActions = list => ({
  type: SET_POS_LIST,
  list
})
// 更新资金信息
export const setFundsActions = data => ({
  type: SET_FUNDS,
  data
})
// 更新码表
export const setInstrumentActions = data => ({
  type: SET_INSTRUMENT_LIST,
  ...data
})
// 更新码表
export const setInstrumentTempActions = list => ({
  type: SET_INSTRUMENT_TEMP_LIST,
  list
})


export const setBanksActions = data => ({
  type: SET_BANKS,
  data
})
