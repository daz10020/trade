// 忽略无数据报错
import { Toast } from 'emrn-common/utils/hybrid'
import { getInstrumentsByIds } from '../conf/Instrument';

// 时间排序
export const timeDesc = key => (a, b) => {
  const { [`${key}Date`]: ad = '', [`${key}Time`]: at = '' } = a
  const { [`${key}Date`]: bd = '', [`${key}Time`]: bt = '' } = b
  const t1 = new Date(`${ad.replace(/^(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')} ${at}`).getTime()
  const t2 = new Date(`${bd.replace(/^(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')} ${bt}`).getTime()
  return t2 - t1
}

// 推送弹窗
export const topToast = options => {
  const { tit, txt } = options
  Toast.show({
    gravity: 'top',
    text: `${tit}\n${txt}`
  })
}

/**
 * 更新数组
 *
 * @param {array} list - 原数组
 * @param {function/string} key - ID格式/ID字段名
 * @param {object} data - 新对象
 *
 * @returns {array}
 *
 */
export const updList = (list, key, data) => {
  // ID函数
  const keyFunc = typeof key === 'string' ? item => item[key] : key
  // 新对象id
  const nid = keyFunc(data)
  // 是否存在
  const hasCache = list.some(item => keyFunc(item) === nid)
  // 更新
  return hasCache
    ? list.map(item => keyFunc(item) === nid ? { ...item, ...data } : item)
    : [{ ...data }].concat(list)
}

/**
 * 合并码表
 *
 * @param {array} list - 原数组
 * @param {function} fmtItem - 格式函数
 * @param {boolean} [disFilter] - 过滤
 *
 * @returns {array}
 *
 */
// 码表遍历
export const fmtList = (list, fmtItem, listFilter) => {
  // 空
  if (!list.length) return []
  // 匹配
  const Instruments = getInstrumentsByIds(list.map(item => item.InstrumentID))
  // 遍历
  const nl = list.map(poi => {
    // 匹配
    const ini = Instruments.find(item  => item && item.InstrumentID === poi.InstrumentID)
    // 合并
    const n = Object.assign({}, poi, ini || {})
    // 无码表则跳过
    return listFilter || ini && typeof fmtItem !== 'function' ? n : ini ? fmtItem(n) : false
  })
  // 遍历
  return (listFilter ? listFilter(nl).map(fmtItem) : nl).filter(i => i)
}
