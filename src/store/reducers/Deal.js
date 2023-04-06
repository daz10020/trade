// 委托列表
import { SET_DEAL_ITEM, SET_DEAL_LIST, SET_STORE } from '../actions/Types';
import { timeDesc, topToast, updList } from '../tools';
import { DIRECTION_TYPE, OFFSET_TYPE } from '../dict'
// 成交列表
export const Deal = (state = [], action) => {
  const { type, list, data, Deal } = action
  let res = state
  switch (type) {
    case SET_STORE:
      Deal && (res = Array.isArray(Deal) ? Deal : updList(state, 'TradeID', Deal))
      break
    // 初始化
    case SET_DEAL_LIST:
      // 更新
      res = list || []
      break
    // 更新用户信息
    case SET_DEAL_ITEM:
      // 更新
      res = updList(state, 'TradeID', data)
      break
    default:
      res = state
  }
  return res.sort(timeDesc('Trade'))
}

// 成交单格式化
export const fmtOfDeal = info => {
  // 声明
  const { Direction, OffsetFlag, OptionsType, Price } = info
  // ASKII解码
  const direction = Number(String.fromCharCode(Direction))
  // 开平仓
  const offsetFlag = Number(String.fromCharCode(OffsetFlag))
  // 开平仓文字
  const offsetTxt = OFFSET_TYPE[offsetFlag]
  // 价格
  const _price = Price - parseInt(Price) < 0.0001 ? parseInt(Price) : Price

  return OptionsType !== 50 && OptionsType !== 49 ? {
    ...info,
    direction, offsetTxt, offsetFlag, _price,
    directionTxt: direction ? '卖出' : '买入',
    directionName: `${DIRECTION_TYPE[direction]}${offsetTxt}`,
  } : false
}


// 成交单
export const creatDealToast = info => {
  // 声明
  const { ClientInstrumentName, Price, Volume, offsetTxt, directionTxt } = info
  let tit = '成交'
  let txt = `${ClientInstrumentName},${Price},${directionTxt}${offsetTxt},${Volume}手`
  // 弹窗
  topToast({ tit, txt })
}
