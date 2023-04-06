'use static'
import Structs from './Structs'
import { Toast, invoke, Permissions } from 'emrn-common/utils/hybrid'
import { EmAlert } from 'emrn-common/components'
import { logError } from '../utils/tools'
import { VSN } from '../conf/constant'

// 获取包结构
const getStruct = code => typeof code === 'string' ? Structs[code] || Structs.base : code
// 打包
export const stringify = (json, packType, zlength) => {
  // 配置
  const conf = getStruct(packType)
  // 声明
  let bufferLen = zlength || 1024
  let buffer = new ArrayBuffer(bufferLen)
  let dv = new DataView(buffer)
  // 合并
  const slength = conf.reduce((acc, cur) => {
    // 声明
    const { key, len, type } = cur
    // 默认值
    let val = json[key] || []
    // 下一字段长度
    const nextValLen = len || (val ? val.length || val.byteLength : 0)
    // 内容长度
    const nextLen = acc + nextValLen
    // 长度不够则拼接
    if (nextLen > bufferLen) {
      // 已转码截取
      const o = new Uint8Array(buffer.slice(0, acc))
      const n = new Uint8Array(nextValLen + 256)
      // 更新
      buffer = new Uint8Array([...o, ...n]).buffer
      dv = new DataView(buffer)
    }
    try {
      // 格式化
      if (/^Uint/i.test(type)) { // Uint
        dv[`set${type}`](acc, val)
      } else if (/^Int/i.test(type)) { // Int
        dv[`set${type}`](acc, val, true)
      } else if (type === 'long') { // Long
        dv.setBigInt64(acc, val, true)
      } else if (type === 'string') { // String
        [...val].forEach((i, idx) => dv.setUint8(acc + idx, String(i).codePointAt()))
      } else if (type === 'buffer') { // Buffer
        // 已转码截取
        const o = new Uint8Array(buffer.slice(0, acc))
        // 判断类型
        const v = typeof val === 'object' && val.length === undefined ? new Uint8Array(val) : val
        // 赋值
        buffer = new Uint8Array([...o, ...v]).buffer
      }
    } catch (e) {
      logError('Socket.stringify', e)
    }
    return nextLen
  }, 0)
  // 截取
  return zlength ? buffer : buffer.slice(0, slength)
}

// 解包
export const parse = (buffer, packType) => {
  // 转码
  const conf = getStruct(packType)
  const dv = new DataView(buffer);
  // 声明
  const res = {}
  // 拆分
  conf.reduce((acc, cur) => {
    // 声明
    const { key, len = 0, type } = cur
    // 进制
    let val = 0
    try {
      // 格式化
      if (/^Uint/i.test(type)) { // Uint
        val = dv[`get${type}`](acc)
      } else if (/^Int/i.test(type)) { // Int
        val = dv[`get${type}`](acc, true)
      } else if (type === 'long') { // Long
        val = dv.getBigInt64(acc, true)
      } else if (type === 'string') { // String
        // 截取
        const bs = len ? buffer.slice(acc, acc + len) : buffer.slice(acc)
        // 解码
        val = transCoding(new Uint8Array(bs))
      } else if (type === 'buffer') { // Buffer
        val = buffer.slice(acc)
      }
      res[key] = val
    } catch (e) {
      logError('Socket.parse', e)
    } finally {
      // 循环
      return acc + (len || (val ? val.length || val.byteLength : 0))
    }
  }, 0)
  return res
}

// 转码
const transCoding = ar => {
  try {
    // 转码
    const res = ar.length > 5000
      ? [].map.apply(ar, [i => String.fromCharCode(i)]).join('')
      : String.fromCharCode(...ar)
    return decodeURIComponent(escape(res))
  } catch (e) {
    logError('Socket.transCoding', e)
    return ''
  }
}

export const hex2buffer = hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))).buffer

export const buffer2hex = buffer => {
  // 判断类型
  const ar = buffer.length === undefined ? new Uint8Array(buffer) : buffer
  // 转码
  return [...ar].map(c => `00${Number(c).toString(16)}`.slice(-2)).join('')
}

/**
 * 结果格式化
 *
 * @param {object} json - 结果
 * @param {object} reqConf - 错误回调
 * @param {boolean} reqConf.isDetail - 是否为单条数据
 * @param {boolean} reqConf.hideErrorMsg - 隐藏提示
 * @param {boolean} reqConf.ignoreEmpty - 忽略空值错误
 *
 * @returns {Promise<object>}
 *
 */
export const _resulteFormatter = async (json, reqConf = {}) => {
  // 配置
  const { hideErrorMsg, ignoreEmpty, isDetail } = reqConf
  // 声明
  const { resultCode, data, Message } = json
  // 正常返回
  if (resultCode - 0 === 0) {
    // 不是数组则报错，
    // 单项空数据报错
    return !Array.isArray(data) || isDetail && !data.length
      // 返回类型错误
      ? Promise.reject({ resultCode: 'ResponseTypeError', data })
      // 数据
      : isDetail ? data[0] : data
    // 忽略空值
  } else if (ignoreEmpty && resultCode - 0 === -212) {
    return data || []
  } else {
    // 默认提示消息
    !hideErrorMsg && Toast.show({ text: Message })
    // 返回错误
    return Promise.reject(json)
  }
}

// 获取设备信息
export const initDeviceParams = globalData => {
  // 声明
  const { Device: { macAddress, euid, isAndroid, model }, AppInfo: { isFutures, appVersionName }, brokerId } = globalData
  // 类型  9-"WAP Futures iOS", 8-"WAP Futures Android", 14-"WAP iOS", 13-"WAP Android"
  const TerminalType = isAndroid ? isFutures ? 8 : 13 : isFutures ? 9 : 14
  // 更新
  return {
    BrokerID: brokerId || '9099',
    // BrokerID: '9099',
    DeviceID: euid,
    TerminalType,
    TerminalVersion: appVersionName,
    ClientAppID: `em${String.fromCharCode(TerminalType + 90)}_${VSN}_${model}`,
    MacAddress: macAddress,
    ClientIPAddress: '',
    BusinessVersion: 2
  }
}


// 获取设备信息
export const initCollectInfo = async (toastFlg, ClientAppID) => {
  // console.log('initCollectInfo')
  // 获取过
  // if (this.ClientSystemInfo) return
  try {
    const { status = '' } = await Permissions.getPermissionStatus({ permission: 'location' })
    // 未授权
    if (status !== 'authorized') {
      // 需弹窗
      if (!toastFlg) return
      // 提示
      await validLocationPermission()
    }
    // 穿透式监管
    const { collectInfo = '' } = await invoke('Futures', 'ctpCollectInfo', { ClientAppID })
    // 更新
    // this.ClientSystemInfo = collectInfo.replace(/\n/g, '')
    return collectInfo.replace(/\n/g, '')
    // this.ClientSystemInfo = 'wXjvuPaD6lFFAiUxGXMjLmOOnatzYshl/BlNSqtzMar7e/Yh5ntLoOO9gKtkbr5gZrHpGgzKmJkubqufbstsUwfUiQ7a8eMN4BBegqj48r6bMrNmKkZyw1kWRbnEaTPmxciHDlBG2OmjpoiOmZmR7qMbeZxW2N+kohg3MEhjnxQfrRgL5fanH2uzAwnnoSdtU2DfKdeWngNh3JzKa6HmoIeeuolFnFStN6dX8OdrKsGacqrDFSqBbwky+oA7IGJq8SI9dBiDM/wqf3MWGiq6ce6MAEmbgCcFlYMjNnOeFU0hTYI1Vj8glImMozyAcgZ0zp55C8J4tExr6run6SkTf9/RYkMHFnxn',
  } catch (e) {
    // 日志
    logError('Socket.initCollectInfo', e)
    // 返回错误
    return Promise.reject(e)
  }
}

// 获取设备信息
export const validLocationPermission = async _ => {
  // 需弹窗
  await new Promise(resolve => EmAlert({
    title: '权限使用提示',
    message: '根据证监会监管要求，期货交易需获取位置权限才能使用，为保证功能的正常使用，请授权使用您的位置权限。',
    buttons: ['知道了'],
    onOk: resolve
  }))
  try {
    // 获取
    await Permissions.request({ permission: 'location' })
  } catch (e) {
    try {
      // 提示开启
      await new Promise((resolve, reject) => EmAlert({
        title: '权限使用提示',
        message: '根据证监会看穿式监管要求，获取“定位”权限才能进行期货交易。',
        buttons: ['取消', '去开启'],
        onOk: resolve,
        onCancel: reject
      }))
      // 去开启
      await Permissions.openSettings({ permission: 'location' })
    } catch (e) {
      // 停止
      return Promise.reject('LocationPermiss')
    }
    // 停止
    return Promise.reject('LocationPermiss')
  }
}

