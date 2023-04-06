// 获取用户名
import {
  setFundsActions,
  setPositionsActions,
  setDealsActions,
  setEntrustsActions,
  setEntrustItemActions,
  setDealItemActions,
  setStore
} from './index';
import { refreshInstrument, getInstrumentsByIds } from '../../conf/Instrument'
import { reqDeals, reqEntrusts, reqFunds, reqPositions } from '../../socket1/apis'
import { fmtOfDeal, creatDealToast } from '../reducers/Deal'
import { fmtOfEntrust, creatEntrustToast } from '../reducers/Entrustment'
import { fmtOfPosi, mergePosiItem } from '../reducers/Positions'
import { logError } from '../../utils/tools'
import quotesCtrl from '../QuotesCtrl'
import { fmtList } from '../tools'
import { jumpUrlFunc } from '../../utils/navigation'

// 资金
export const getFundsData = async (isDelay, withoutCalc) => {
  // 获取
  const res = await reqFunds(isDelay)
  //声明
  const { PreBalance, PreCredit, PreMortgage, Mortgage, Deposit, Withdraw } = res || {}
  // 合并
  const Funds = {
    ...res,
    staticEquity: PreBalance - PreCredit - PreMortgage + Mortgage,
    crj: Deposit - Withdraw
  }
  // 更新
  quotesCtrl.setProps({ Funds })
  // 返回
  return withoutCalc ? Funds : quotesCtrl.calcFunds()
}

// 持仓
export const getFunds = _ => async dispatch => dispatch(setFundsActions(await getFundsData()))

// 持仓
export const getPositionsData = async isDelay => {
  // 远程拉取
  const res = await reqPositions(isDelay)
  // 格式化
  const Positions = fmtList(res, fmtOfPosi, mergePosiItem)
  // 更新内容
  quotesCtrl.setProps({ Positions })
  // 返回持仓
  return Positions
}

// 持仓
export const getPositions = _ => async (dispatch, getState) => {
  // 获取持仓
  const pos = await getPositionsData()
  // 更新内容
  quotesCtrl.refresh()
  // 提交
  // return dispatch(setPositionsActions(pos))
  return pos
}

// 委托
export const getEntrustsData = async _ => {
  // 远程拉取
  const Entrusts = await reqEntrusts()
  // 格式化
  return fmtList(Entrusts, fmtOfEntrust)
}
// 委托
export const getEntrusts = _ => async dispatch => dispatch(setEntrustsActions(await getEntrustsData()))

// 成交
export const getDealsData = async _ => {
  // 远程拉取
  const res = await reqDeals()
  // 格式化
  const Deals = fmtList(res, fmtOfDeal)
  // 更新内容
  quotesCtrl.setProps({ Deals })
  // 返回
  return Deals
}
// 成交
export const getDeals = _ => async dispatch => dispatch(setDealsActions(await getDealsData()))

// // 获取基本信息
// export const getAccountInfo = _ => async (dispatch, getState) => {
//   // 码表
//   await refreshInstrument()
//   // 资金、持仓、委托、成交
//   const [Funds, Positions, Entrustment, Deal] = await Promise.all([
//     getFundsData().catch(_ => null),
//     getPositionsData().catch(_ => null),
//     getEntrustsData().catch(_ => null),
//     getDealsData().catch(_ => null)
//   ])
//   // 更新
//   dispatch(setStore({ Funds, Positions, Entrustment, Deal }))
// }

export const updStore = dispatch => data => dispatch(setStore(data))

// 推送接收器
export const receiver = dispatch => async json => {
  // console.log('receiver')
  // 声明
  const { messageID, resultCode, data } = json
  // 无数据
  if (!Array.isArray(data) || !data.length) return
  // 未确认结算单
  if (resultCode === 42) {
    // 跳转
    return jumpUrlFunc({ linkType: 3, linkUrl: 'Bill', method: 'replace' })
  }
  // 内容
  const [res] = data
  // 码表数据
  const Instrument = getInstrumentsByIds(res.InstrumentID) || {}
  // 码表
  const n = { ...res, ...Instrument }
  // 集合
  const nStore = {}
  // 报单推送
  if (messageID === 40001) {
    // 只更新委托
    if (!dispatch(updEntrusts(n))) return
    // 成交推送
  } else if (messageID === 40001) {
    // 只更新委托
    if (!dispatch(updEntrusts(n))) return
    // 出入金更新
  } else if (messageID === 40004 || messageID === 40005) {
    try {
      return await getFunds(true)
    } catch (e) {
      logError(`${messageID}Error`, e)
    }
  }
  try {
    // 资金、持仓
    const [Funds, Positions] = await Promise.all([getFundsData(true), getPositionsData(true)])
    // 更新
    Object.assign(nStore, { Funds, Positions })
    // 重连
    quotesCtrl.refresh(nStore)
  } catch (e) {
    logError('receiverError', e)
  // } finally {
  //   // 更新
  //   dispatch(setStore(nStore))
  }

}

// 更新委托列表
export const updEntrusts = info => dispatch => {
  // 格式化数据
  const res = fmtOfEntrust(info)
  // 更新
  dispatch(setEntrustItemActions(res))
  // 更新
  return creatEntrustToast(res)
}

// 更新委托列表
export const updDeals = info => {
  // 格式化数据
  const res = fmtOfDeal(info)
  // 弹窗
  creatDealToast(res)
  // 返回结果
  return res
}

// 清空账户信息
export const clearAccountInfo = dispatch => {
  // 清空
  dispatch(setStore({
    Funds: {},
    Deal: [],
    Positions: [],
    Entrustment: []
  }))
}
