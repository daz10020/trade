import { getGlobalData } from '../conf/tools'
import { formatDateTime } from 'emrn-common/utils/format';

//只有日盘品种计算盯市时间
export const SP_DAY_TIMEPOINTS = ["090000", "180000"]
//债券计算盯市时间
export const ZQ_TIMEPOINTS = ["093000_180000"]
//股指计算盯市时间
export const GZ_TIMEPOINTS = ["093000_180000"]
//有夜盘品种盯市计算时间
export const SP_NIGHT_TIMEPOINTS = ["000000_180000", "210000_235959"]

// // export const convertToDingshiKey(String market, String code) {
// //   if (isZhenzhouFutures(market)) {
// //     return "115_" + code;
// //   }
// //   if (isDalianFutures(market)) {
// //     return "114_" + code;
// //   }
// //   if (isShanghaiFutures(market)) {
// //     return "113_" + code;
// //   }
// //   if (isShanghaiINE(market)) {
// //     return "142_" + code;
// //   }
// //   if (isShanghaiCFFEX(market)) {
// //     return "8_" + code;
// //   }
// //   return market + "_" + code;
// // }
// 市场代码
const MARKET = {
  SHFE: 113,
  DCE: 114,
  CZCE: 115,
  DCEOPTION: 140,
  CZCEOPTION: 141,
  INE: 142,
  SHFEOPTION: 151,
  CFFEX: 8,
  CFFEXOPTION: 221,
  GFEX: 225,
  GFEXOPTION: 226
}

// 中金所
const CFFEX_PRODUCTID = { IF: '0411', TF: '0511', IC: '0611', IH: '0711', TS: '1311', T: '1111', IM: '1511' }

/**
 * transUid 生成合约Uid
 *
 * @param {object} mkt - 合约数据
 * @param {object} [options] - 配置
 * @param {string} options.mktKey - 市场ID字段名
 * @param {string} options.codeKey - 合约代码字段名
 *
 * @returns {string} - 生成uid
 */
export const transUid = (obj, options) => {
  // 版本号
  const { appVersionCode } = getGlobalData('AppInfo') || {}
  // 字段名
  const { mktKey = 'ExchangeID', codeKey = 'InstrumentID' } = options || {}
  // 合约数据
  const { [mktKey]: mkt, [codeKey]: code } = obj || {}
  // 无数据
  if (!mkt || !code) return ''
  // 转换过 直接返回结果
  if (!/\D/.test(mkt)) return `${mkt}_${code}`
  // 市场ID
  let marketId = MARKET[mkt]
  // 品种代码
  let dm = code
  // // 中金所
  // if (marketId === 8) {
  //   // 市场
  //   const productId = code.replace(/\d/g, '').toUpperCase()
  //   // 拼接
  //   dm = `${CFFEX_PRODUCTID[productId]}${code.substr(-2)}`
  // }
  // 中金所
  if (marketId === 8) {
    if (Number(appVersionCode) >= 10005000) {
      marketId = 220
    } else {
      // 市场
      const productId = code.replace(/\d/g, '').toUpperCase()
      // 拼接
      dm = `${CFFEX_PRODUCTID[productId]}${code.substr(-2)}`
    }
  }
  return `${marketId}_${dm}`
}

// 期权
export const isQhOptions = ProductClass => ProductClass === 50 || ProductClass === 54

// 盯市
// isOptions 是否期权
export const isNeedCalcDingshi = (codeKey, isOptions) => {
  // 支持夜盘
  if (isOptions) return isInTimeRange(SP_NIGHT_TIMEPOINTS)
  // 夜盘品种
  const { nightCodes: { datas = []} = {}} = getGlobalData('conf_futuresApp') || {}
  // 品种数据
  const futuresInfo = datas.find(({ code = '' }) => code.split(',').some(i => codeKey.toLowerCase() === i))
  // 未匹配到
  if (!futuresInfo) return true
  // 判断
  const { market, type } = futuresInfo
  // 中金所
  if (market == 8 || market == 220) {
    // 股指
    if (type == 168) {
      return isInTimeRange(GZ_TIMEPOINTS)
    } else if (type == 169) {// 债券
      return isInTimeRange(ZQ_TIMEPOINTS)
    }
    return isInTimeRange(GZ_TIMEPOINTS)
  } else if (type == 1) {// 商品支持夜盘
    return isInTimeRange(SP_NIGHT_TIMEPOINTS)
  }
  // 商品不支持夜盘
  return isInTimeRange(SP_NIGHT_TIMEPOINTS)
}

// 时间区间内
const isInTimeRange = (range) => {
  // 当前时间
  const timeNow = formatDateTime(new Date(), 'HHmmss')
  // 是否在区间内
  return range.some(r => {
    const [start, end] = r.split('_')
    return timeNow > parseInt(start) && timeNow < parseInt(end)
  })
}
