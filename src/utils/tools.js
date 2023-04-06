'use strict'

import { Platform, AppState } from 'react-native'
import { Tracker, Logger, invoke } from 'emrn-common/utils/hybrid'
import EmEventEmitter from 'emrn-common/utils/EmEventEmitter'
import withPageTracker from 'emrn-common/components/withPageTracker'
import { GLOBAL_KEY } from '../conf/constant'
import { accDiv } from './calculate'

// ios
const isIos = Platform.OS === 'ios'

// 浅对比更新
export const shouldUpdate = (nextProps, nextState, that) => {
  const { props, state } = that
  // props Change
  const propsFlg = nextProps && props && Object.keys(nextProps).some(key => {
    const npVal = nextProps[key]
    return typeof npVal !== 'function' && npVal !== props[key]
  })
  // state Change
  const stateFlg = nextState && state && Object.keys(nextState).some(key => nextState[key] !== state[key])
  // console.log(`propsFlg:${propsFlg}`)
  // console.log(`stateFlg:${stateFlg}`)
  return propsFlg || stateFlg
}

// 获取组件节点
export const setRefs = (name, that) => dom => {
  const { doms = {} } = that
  that.doms = Object.assign(doms, { [name]: dom })
}

// 埋点
export const trackEvent = (trackName, params) => {
  Tracker.trackEvent({
    name: `${GLOBAL_KEY}.${trackName}`,
    type: 'click',
    params: params ? JSON.stringify(params) : ''
  }).catch(e => logError(trackName, e))
}

// 错误日志
export const logError = (tag, error, logType = 'error') => {
  // console.log(tag)
  // console.log(error)
  const errorType = typeof error
  let msg = ''
  try {
    msg = errorType === 'object' ? JSON.stringify(error) : error
  } catch (e) {
    msg = error.toString ? error.toString() : error
  }
  // 保存日志
  Logger[logType]({ tag: `${GLOBAL_KEY}.${tag}`, msg })
}


/**
 * 随机生成固定位数或者一定范围内的字符串数字组合
 *
 * @param {Number} min - 范围最小值
 * @param {Number,String} [max] - 范围最大值，当不传递时表示生成指定位数的组合
 * @param {String} [charStr] - 指定的字符串中生成组合
 *
 * @return {String} 返回字符串结果
 * */
export const randomRange = (min, max, charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let returntr = ''
  typeof min === 'undefined' && (min = 10)
  typeof max === 'string' && (charStr = max)
  const range = ((max && typeof max === 'number') ? Math.round(Math.random() * (max - min)) + min : min)
  for (let i = 0; i < range; i++) {
    const index = Math.round(Math.random() * (charStr.length - 1))
    returntr += charStr.substring(index, index + 1)
  }
  return returntr
}

/**
 * 百分比格式化
 *
 * @param {Number} val - 值
 * @param {Number} total - 总
 * @param {Number} prec - 精度
 *
 * @return {String} 返回字符串结果
 * */
export const val2Perc = (val, total, prec = 2) => {
  const perc = ((total ? accDiv(val, total) : 0) * Math.pow(10, prec)).toFixed(prec)
  return `${perc || Number(0).toFixed(prec)}%`
}

/**
 * AppState 变化监听
 *
 * @param {Function} func - AppState变化回调
 *
 * @return {Function} 返回销毁函数
 * */
export const AppStateFunc = func => {
  AppState.addEventListener('change', func)
  return _ => AppState.removeEventListener('change', func)
}

/**
 * 返回RN页面监听
 *
 * @param {Function} leaveFunc - 跳出RN页面
 * @param {Function} backFunc - 返回RN页面
 *
 * @return {Function} 返回销毁函数
 * */
export const AppearFunc = (leaveFunc, backFunc) => {
  // 置入后台
  const leaveEmitter = EmEventEmitter.addListener('controllerWillDisappear', leaveFunc)
  // 进入前台
  const backEmitter = EmEventEmitter.addListener('controllerWillAppear', backFunc)
  // ios适配
  const stateFunc = nextAppState => /inactive|background/.test(nextAppState) ? leaveFunc() : backFunc()
  // ios建立置入后台监听
  isIos && AppState.addEventListener('change', stateFunc)
  // 返回清理监听函数
  return _ => {
    EmEventEmitter.removeListener('controllerWillDisappear', leaveFunc, leaveEmitter)
    EmEventEmitter.removeListener('controllerWillAppear', backFunc, backEmitter)
    isIos && AppState.removeEventListener('change', stateFunc)
  }
}

/**
 * 账号混淆
 *
 * @param {string} account - 跳出RN页面
 *
 * @return {string} 返回混淆后的字符串
 * */
export const confuseAcc = (account = '') => String(account).replace(/^(\d{2})(.*)(\d{2})$/, '$1***$3')

/**
 * 页面埋点
 *
 * @param {Function} component - 页面组件
 * @param {String} pageId - 页面ID
 *
 * @return 组件
 * */
export const pageTracker = (component, pageId) => withPageTracker(component, `${GLOBAL_KEY}_${pageId}`)

/**
 * 计算单元格字体
 *
 * @param {String} string - 字符串
 *
 * @return {number} 权重
 * */
export const calcStrWidth = string => {
  // 直接返回
  if (!string) return 0
  // 格式化
  const str = String(string)
  // 小写字母及数字数量
  const lcl = str.replace(/[^a-z\d]/g, '').length
  // 符号数量
  const fcl = str.replace(/[^\x21-\x3F\x5B-\x7E]/g, '').length - lcl
  // 大写字母数量
  const hcl = str.replace(/[^A-Z]/g, '').length
  // const zl = name.replace(/[^\p{Unified_Ideograph}]/ug, '').length
  // const zl = name.replace(/[^\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}]/ug, '').length
  // 中文字符数量
  const zl = str.replace(/[^\u4e00-\u9fa5]/g, '').length
  // 返回
  return 6 * lcl + hcl * 7 + zl * 9 + 4 * fcl
}

/**
 * 计算指定宽度字体大小
 *
 * @param {Object} options - 字体大小
 * @param {Number,String} options.upper - 宽度上限
 * @param {Number} options.[fz] - fontSize
 * @param {Number} options.[minFz] - fontSize下限
 *
 * @return {Function} 权重
 * */
export const calcFZ = options => {
  // 声明
  const { fz = 28, upper, minFz = 20 } = options
  // 宽度上限
  const upperWidth = typeof upper === 'number' ? upper : calcStrWidth(upper)
  // 返回
  return str => {
    // 当前文字宽度
    const width = calcStrWidth(str)
    // 未超出
    if (width < upperWidth) return fz
    // 字体
    const fzVal = fz - (width - upperWidth) / 3
    // 返回
    return fzVal > minFz ? fzVal : minFz
  }
}
