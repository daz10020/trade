'use strict'
// 码表
import { reqInstrument } from '../socket1/apis'
import { INSTRUMENT_CACHE_KEY, INSTRUMENT_EXPIRE_TIME } from './constant';
import { getCache, setCache } from '../utils/cache';
import { logError } from '../utils/tools';

// // 临时码表
// let temp = {}
// const Instrument = {}
//
// // 初始化码表
// export const initInstrument = async _ => {
//   // 声明
//   let cache = {}
//   try {
//     // 获取缓存
//     // cache = await getCache(INSTRUMENT_CACHE_KEY) || {}
//   } catch (e) {
//     logError('initInstrument', e)
//   }
//   // 声明
//   const { data, timestamp = 0 } = cache
//   // 无数据
//   if (!data || new Date().getTime() - timestamp > INSTRUMENT_EXPIRE_TIME) return
//   // 更新码表
//   Object.assign(Instrument, { data, timestamp })
//   console.log('Instrument')
//   console.log(Instrument)
// }
//
// // 初始化码表
// export const cacheInstrument = async _ => {
//   // 时间
//   const { isNeedCache } = Instrument || {}
//   // 无数据
//   if (!isNeedCache) return
//   try {
//     // 缓存
//     await setCache(INSTRUMENT_CACHE_KEY, Instrument)
//     // 重置
//     Instrument.isNeedCache = false
//   } catch (e) {
//     logError('cacheInstrument', e)
//   }
// }
//
// // 初始化码表
// export const refreshInstrument = async _ => {
//   // 时间
//   const { timestamp = 0 } = Instrument || {}
//   // 当前时间
//   const dt = new Date().getTime()
//   // 至少一小时更新一次
//   if (dt - timestamp < INSTRUMENT_EXPIRE_TIME) return
//   // 请求数据
//   const list = await reqInstrument()
//   // 集合
//   const data = {}
//   // 整理
//   list.forEach(item => typeof item === 'object' && (data[item.InstrumentID] = item))
//   // 获取码表
//   Object.assign(Instrument, { data, timestamp: dt, isNeedCache: true })
//   // 清空临时码表
//   temp = {}
// }
//
// // 获取合约信息
// export const getInstrumentsByIds = uids => {
//   console.log('Instrument')
//   console.log(Instrument)
//   // 是否为单个
//   const singleFlg = !Array.isArray(uids)
//   // 统一数组
//   const ids = singleFlg ? [uids] : uids
//   // 内容
//   const { data = {} } = Instrument
//   // 筛选
//   const res = ids.map(id => {
//     // 过滤缓存
//     let info = temp[id]
//     // 未记录
//     if (!info) {
//       // 总表遍历
//       info = data[id]
//       // 记录
//       info && (temp[id] = info)
//     }
//     return info || {}
//   })
//   console.log('getInstrumentsByIds')
//   console.log(temp)
//   console.log(res)
//   // 返回
//   return singleFlg && res.length ? res[0] : res
// }
//
//
// // 获取合约信息
// export const getInstrumentsUpdTime = _ => Instrument.timestamp || 0


class Instrument {
  // 构造函数
  constructor() {
    // 临时码表
    this.temp = {}
    this.Instrument = {}
  }

  InitInstrument = async _ => {
    // 声明
    let cache = {}
    try {
      // 获取缓存
      cache = await getCache(INSTRUMENT_CACHE_KEY) || {}
    } catch (e) {
      logError('initInstrument', e)
    }
    // 声明
    const { data, timestamp = 0 } = cache
    // console.log(cache)
    // 无数据
    if (!data || typeof data !== 'object' || !Object.keys(data).length || new Date().getTime() - timestamp > INSTRUMENT_EXPIRE_TIME) return
    // 更新码表
    Object.assign(this.Instrument, { data, timestamp })
    // console.log('Instrument')
    // console.log(this.Instrument)
  }

  // 初始化码表
  cacheInstrument = async _ => {
    // 时间
    const { Instrument: { isNeedCache }, Instrument } = this || {}
    // 无数据
    if (!isNeedCache) return
    try {
      // 缓存
      await setCache(INSTRUMENT_CACHE_KEY, Instrument)
      // 重置
      Instrument.isNeedCache = false
    } catch (e) {
      logError('cacheInstrument', e)
    }
  }

  // 初始化码表
  refreshInstrument = async flg => {
    // 时间
    const { Instrument: { timestamp = 0 }, Instrument } = this || {}
    // 当前时间
    const dt = new Date().getTime()
    // 至少一小时更新一次
    if (!flg && dt - timestamp < INSTRUMENT_EXPIRE_TIME) return
    // 请求数据
    const list = await reqInstrument()
    // 集合
    const data = {}
    // 整理
    list.forEach(item => typeof item === 'object' && (data[item.InstrumentID] = item))
    // 获取码表
    Object.assign(Instrument, { data, timestamp: dt, isNeedCache: true })
  }

  // 获取合约信息
  getInstrumentsByIds = uids => {
    // console.log('Instrument')
    // console.log(Instrument)
    // 是否为单个
    const singleFlg = !Array.isArray(uids)
    // 统一数组
    const ids = singleFlg ? [uids] : uids
    // 内容
    const { Instrument: { data = {} }, temp } = this
    // 筛选
    const res = ids.map(id => {
      // 过滤缓存
      let info = temp[id]
      // 未记录
      if (!info) {
        // 总表遍历
        info = data[id]
        // 记录
        info && (temp[id] = info)
      }
      return info || undefined
    })
    // console.log('getInstrumentsByIds')
    // console.log(temp)
    // console.log(res)
    // 返回
    return singleFlg && res.length ? res[0] : res
  }
  // 获取合约信息
  getInstrumentsUpdTime = _ => this.Instrument.timestamp || 0
}

// 定时器
const instrument = new Instrument()

export const getInstrumentsByIds = instrument.getInstrumentsByIds
export const refreshInstrument = instrument.refreshInstrument
export const cacheInstrument = instrument.cacheInstrument
export const initInstrument = instrument.InitInstrument
export const getInstrumentsUpdTime = instrument.getInstrumentsUpdTime

