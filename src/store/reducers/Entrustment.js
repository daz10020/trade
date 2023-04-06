// 委托列表
import { SET_ENTRUST_ITEM, SET_ENTRUST_LIST, SET_STORE } from '../actions/Types'
import { timeDesc, topToast, updList } from '../tools'
import {
  DIRECTION_TYPE,
  OFFSET_TYPE,
  STATUS_TYPE,
  CAN_REVOKE_TYPE,
  TFtdcOrderSubmitStatusType,
  TFtdcOrderStatusType,
} from '../dict'

export const Entrustment = (state = [], action) => {
  const { type, list, data, Entrustment } = action
  let res = state
  switch (type) {
    case SET_STORE:
      Entrustment && (res = Array.isArray(Entrustment) ? Entrustment : updList(state, 'id', Entrustment))
      break;
    // 初始化
    case SET_ENTRUST_LIST:
      // 更新
      res = list || []
      break;
    // 更新用户信息
    case SET_ENTRUST_ITEM:
      // 更新
      res = updList(state, 'id', data)
      break;
    default:
      res = state
  }
  return res.sort(timeDesc('Insert'))
}

// 委托单格式化
export const fmtOfEntrust = item => {
  // 声明
  const { OrderStatus, Direction, OrderSubmitStatus, CombOffsetFlag, OrderLocalID, TraderID, BrokerID, OptionsType } = item
  // ASKII解码
  const direction = Number(String.fromCharCode(Direction))
  // 状态 OrderStatus值有0-5(ASKII值为48-53), a-c(97-99)
  const orderStatus = STATUS_TYPE[OrderStatus]
  // 是否可以撤单,true可以撤单
  const canRevokeFlg = CAN_REVOKE_TYPE.some(i => i === OrderStatus)
  // 开平仓
  const combOffsetFlag = Number(CombOffsetFlag)
  // 开平仓文字
  const offsetTxt = OFFSET_TYPE[combOffsetFlag]
  // 返回
  return OptionsType !== 50 && OptionsType !== 49 ?{
    ...item,
    id: `${BrokerID}_${TraderID}_${OrderLocalID}_${Direction}`,
    canRevokeFlg, offsetTxt, combOffsetFlag, direction,
    directionTxt: direction ? '卖出' : '买入',
    // 状态名称
    orderStatusName: OrderSubmitStatus === 52 ? '废单' : orderStatus,
    directionName: `${DIRECTION_TYPE[direction]}${offsetTxt}`,
  } : false
}


// 委托消息弹窗
export const creatEntrustToast = info => {
  // 声明
  const {
    ClientInstrumentName, LimitPrice, VolumeTotalOriginal, ActiveUserID, ZCETotalTradedVolume,
    StatusMsg, ClientOrderSysID, OrderSysID, OrderSubmitStatus, OrderStatus, CombOffsetFlag, direction
  } = info
  let tit = ''
  let txt = ''
  let needRefresh = false
  // 报单状态
  const { THOST_FTDC_OSS_InsertSubmitted, THOST_FTDC_OSS_InsertRejected, THOST_FTDC_OSS_CancelRejected } = TFtdcOrderSubmitStatusType
  const {
    THOST_FTDC_OST_Unknown, THOST_FTDC_OST_NoTradeQueueing, THOST_FTDC_OST_NoTradeNotQueueing,
    THOST_FTDC_OST_Canceled, THOST_FTDC_OST_AllTraded, THOST_FTDC_OST_PartTradedNotQueueing, THOST_FTDC_OST_PartTradedQueueing
  } = TFtdcOrderStatusType

  // 无需弹窗
  if (OrderStatus === THOST_FTDC_OST_AllTraded
    || OrderStatus === THOST_FTDC_OST_PartTradedNotQueueing
    || OrderStatus === THOST_FTDC_OST_PartTradedQueueing
    || ZCETotalTradedVolume > 0) return false
  // 判断
  if (OrderStatus === THOST_FTDC_OST_Unknown && OrderSubmitStatus === THOST_FTDC_OSS_InsertSubmitted) {
    const buyOrSellDesc = `${DIRECTION_TYPE[direction]}${CombOffsetFlag === '0' ? '开' : '平'}仓`
    if (OrderSysID && OrderSysID.length) {
      tit = '委托成功'
      txt = `${ClientInstrumentName},委托号:${ClientOrderSysID}`
      needRefresh = true
    } else {
      tit = '委托发出'
      txt = `${ClientInstrumentName},${LimitPrice},${buyOrSellDesc},${VolumeTotalOriginal}手`
    }
  } else if (OrderStatus === THOST_FTDC_OST_NoTradeQueueing && ActiveUserID && ActiveUserID.length) {
    tit = '撤单申请'
    txt = `${ClientInstrumentName},撤${VolumeTotalOriginal}手,委托号:${ClientOrderSysID}`
    needRefresh = true
  } else if (OrderStatus === THOST_FTDC_OST_NoTradeQueueing || OrderStatus === THOST_FTDC_OST_NoTradeNotQueueing) {
    tit = '委托成功'
    txt = `${ClientInstrumentName},委托号:${ClientOrderSysID}`
    needRefresh = true
  } else if (OrderStatus === THOST_FTDC_OST_Canceled) {
    if (OrderSubmitStatus === THOST_FTDC_OSS_InsertRejected) {
      tit = '委托失败'
      txt = `${ClientInstrumentName},原因:${StatusMsg}`
    } else if (OrderSubmitStatus === THOST_FTDC_OSS_CancelRejected) {
      tit = '撤单失败'
      txt = `${ClientInstrumentName},原因:${StatusMsg}`
    } else {
      tit = '撤单成功'
      txt = `${ClientInstrumentName},委托号:${ClientOrderSysID}`
      needRefresh = true
    }
  } else {
    tit = '委托失败'
    txt = `${ClientInstrumentName},原因:${StatusMsg}`
  }
  // 弹窗
  topToast({ tit, txt })
  // 返回刷新标记
  return needRefresh
}
