import { tradeReq } from './TradeReq'

export const reqLogin = ({ userId, password, token, LoginType = '0' }) => tradeReq.request('10001', {
  UserProductInfo: 'EMTrade',
  LoginType,
  UserID: userId,
  InvestorID: userId,
  Password: password,
  Token: token
}, { isDetail: true, hideErrorMsg: true })

// 登出
export const reqLogout = userId => tradeReq.request('10002', {
  UserID: userId,
  InvestorID: userId
})

// 银期转账
export const postB2F = params => tradeReq.request('10004', {
  TradeCode: '202001',
  SecuPwdFlag: '',
  ...params
}, { isDetail: true })

// 期银转账
export const postF2B = params => tradeReq.request('10005', {
  TradeCode: '202002',
  ...params
}, { isDetail: true })

// 委托列表
export const reqEntrusts = _ => tradeReq.request('30001', undefined, { ignoreEmpty: true })

// 成交列表
export const reqDeals = _ => tradeReq.request('30002', undefined, { ignoreEmpty: true })

// 查询用户信息
export const reqUserInfo = _ => tradeReq.request('30003', undefined, { isDetail: true })

// 查询确认单内容
export const reqVerifyDetail = _ => tradeReq.request('30007', { TradingDay: '' }, { isDetail: true, hideErrorMsg: true })

// 查询确认结果
export const reqVerifyResult = _ => tradeReq.request('30008', undefined, { isDetail: true, hideErrorMsg: true })

// 资金详情
export const reqFunds = isDelay => tradeReq.request('30009', undefined, { isDetail: true, isDelay })

// 查询银行信息
export const reqBanks = _ => tradeReq.request('30011', undefined)

// 查询银行余额
export const reqBankBalance = params => tradeReq.request('30012', {
  ...params,
  TradeCode: '204002'
}, { isDetail: true })

// 码表
export const reqInstrument = _ => tradeReq.request('30013', {
  InstrumentID: '',
  ExchangeID: '',
  ExchangeInstID: '',
  ProductID: ''
})

// 持仓列表
export const reqPositions = isDelay => tradeReq.request('30014', undefined, { ignoreEmpty: true, isDelay })

// 确认结算单
export const postVerify = _ => tradeReq.request('30015', undefined, { isDetail: true })

// 查询银期签约关系
export const reqAccountregister = _ => tradeReq.request('30016', undefined, { ignoreEmpty: true })

// 查询最大报单数
export const reqMaxOrderVolume = InstrumentID => tradeReq.request('30017', {
  Direction: 48, HedgeFlag: 49, OffsetFlag: 48, InstrumentID
}, { isDetail: true })

// 查询保证金率
export const reqMarginRate = InstrumentID => tradeReq.request('30020', {
  InstrumentID,
  HedgeFlag: 49
}, { isDetail: true })

// 提交订单
export const postOrder = params => {
  // 声明
  const { code, direction, price, offsetFlg, volume, ExchangeID } = params
  // 自增
  const orderRef = ++tradeReq.orderRef
  // 请求数据
  return tradeReq.request('20001', {
    CombHedgeFlag: '1',
    CombOffsetFlag: String(offsetFlg),
    ContingentCondition: 49,
    CurrencyID: 'CNY',
    Direction: String(direction).charCodeAt(0),
    ExchangeID,
    ForceCloseReason: 48,
    InstrumentID: code,
    LimitPrice: String(price),
    MinVolume: 1,
    OrderPriceType: 50,
    OrderRef: String(orderRef),
    StopPrice: 0.0,
    TimeCondition: 51,
    VolumeCondition: 49,
    VolumeTotalOriginal: String(volume),
  }, { isDetail: true })
}

// 撤单
export const delOrder = params => {
  // 声明
  const { InstrumentID, FrontID, OrderRef, SessionID } = params
  // 请求数据
  return tradeReq.request('20002', {
    ActionFlag: 48,
    FrontID,
    InstrumentID,
    LimitPrice: 0.0,
    OrderRef,
    SessionID,
    VolumeChange: 0,
  }, { isDetail: true })
}
