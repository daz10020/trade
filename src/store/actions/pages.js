// 获取用户名
import {
  getPositionsData,
  getFundsData,
  getEntrustsData,
  getDealsData,
  getFunds,
} from './funds'
import { setStore } from './index'
import { getGlobalData } from '../../conf/tools'
import { getBanks } from './banks'
import { refreshInstrument } from '../../conf/Instrument'
import quotesCtrl from "../QuotesCtrl";

// 首页
export const MainFunc = tabParam => async dispatch => {
  // 初始变量
  const tab = tabParam || getGlobalData('StartupParams').tab || 0
  // 先请求资金与持仓
  if (!tab || tab < 2) {
    // 获取数据
    const [Funds, Positions] = await Promise.all([
      getFundsData().catch(_ => null),
      getPositionsData().catch(_ => null),
    ])
    if (quotesCtrl.hqList.length) {
      // 建立链接
      quotesCtrl.updFunc()
    } else {
      // 更新
      dispatch(setStore({ Funds, Positions }))
    }
    // 建立链接
    quotesCtrl.refresh()
    // 先请求委托与成交
    Promise.all([
      getEntrustsData().catch(_ => null),
      getDealsData().catch(_ => null)
    ]).then(([Entrustment, Deal]) => {
      // 更新
      dispatch(setStore({ Entrustment, Deal }))
      // 建立链接
      quotesCtrl.updFunc()
    })
  } else {
    // 先请求委托与成交
    const [Entrustment, Deal] = await Promise.all([
      getEntrustsData().catch(_ => null),
      getDealsData().catch(_ => null)
    ])
    // 更新
    dispatch(setStore({ Entrustment, Deal }))
    // 获取数据
    Promise.all([
      getFundsData().catch(_ => null),
      getPositionsData().catch(_ => null),
    ]).then(([Funds, Positions]) => {
      // 建立链接
      quotesCtrl.refresh()
      // 更新
      dispatch(setStore({ Funds, Positions }))
    })
  }
}

// 银期
export const BanksFunc = _ => async dispatch => {
  // 资金
  dispatch(await getFunds())
  // 银期
  dispatch(await getBanks())
  // // 获取数据
  // const [Entrustment, Deal, Positions] = await Promise.all([
  //   getEntrustsData().catch(_ => null),
  //   getDealsData().catch(_ => null),
  //   getPositionsData().catch(_ => null),
  // ])
  // // 更新
  // dispatch(setStore({ Entrustment, Deal, Positions }))
}

const funcs = {
  MainFunc, BanksFunc
}

// 对应页面更新
export const getInfoByPage = page => async dispatch => {
  // 更新码表
  await refreshInstrument()
  // 声明
  const func = funcs[`${page}Func`]
  // 执行
  return typeof func === 'function' ? dispatch(func()) : null
}
