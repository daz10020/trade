// 获取最新配置信息
import http from '../apis'
import { GLOBAL_KEY, VSN, USERS_AUTH_KEY } from './constant'
import { logError } from '../utils/tools'
import linkTracker from '../utils/LinkTracker'
import { getSingleConf, setGlobalData } from './tools'
import { Container } from 'emrn-common/utils/hybrid'
import { tradeReq } from '../socket1/TradeReq'
import socket from '../socket1'
import { getCache, delCache } from '../utils/cache'

export const getGlobalConf = options => {
  try {
    // 声明
    return getSingleConf({
      api: 'global',
      delay: 0,
      getConf: async oConf => {
        // 线上
        const nConfs = await http.request('globalConf') || []
        // 最新配置
        const [nConf] = nConfs.filter(conf => conf.version === VSN)
        // 判断是否需要更新
        // return !oConf || Object.keys(nConf).some(key => nConf[key] !== oConf[key]) ? nConf : false
        return nConf
      },
      // 判断需要加载的配置文件
      render: conf => Promise.all(Object.keys(conf).map(async key => {
        // 忽略版本字段
        if (key === 'version' || key === 'MD5') return
        // 标识
        const MD5 = conf[key]
        // 配置名称
        const keyCode = `conf_${key}`
        // 获取单个配置
        return getSingleConf({
          api: key,
          delay: 0,
          // 设置全局变量
          render: async conf => setGlobalData(keyCode, conf),
          getConf: async oConf => {
            // 声明
            if (oConf && oConf.MD5 === MD5) return oConf
            // 线上数据
            const res = await http.request(keyCode) || {}
            // 返回结果
            return { ...res, MD5 }
          }
        })
      }))
    })
  } catch (e) {
    logError(`getGlobalConf`, e)
  }
}

export const initHybirdConf = async _ => {
  // console.log('initHybirdConf')
  // 全局数据对象
  const globalCustomData = global[GLOBAL_KEY]
  // 声明
  const { getApplicationInfo, getEnv } = Container
  // 全局
  const [AppInfo, { env }] = await Promise.all([getApplicationInfo(), getEnv()])
  // 应用信息
  globalCustomData.AppInfo = { ...AppInfo, isFutures: AppInfo.appType === 'qhb' }
  // 环境
  globalCustomData.env = env
  // 全局配置
  await getGlobalConf()
  // await delCache(USERS_AUTH_KEY)
  // 权限验证
  if (await getCache(USERS_AUTH_KEY)) {
    // 设备信息
    await initDeviceInfo()
  }
  // console.log(globalCustomData)
  // 返回结果
  return globalCustomData
}

// 更新静态配置
export const initZhuChiConf = _ => getSingleConf({
  api: 'ZhuChi',
  delay: 0,
  getConf: async oconf => {
    try {
      // 线上
      const { uptime: md5, list } = await http.get('ZhuChiConf', { field: 'maintype,ucode', maintype: 2 }) || {}
      // 返回错误
      if (!md5 || !list || !list.length) return false
      // 返回
      return {
        md5,
        ids: list.reduce((res, i) => {
          // 声明
          const { maintype, ucode } = i
          // 添加
          res[ucode] = maintype
          // 返回
          return res
        }, {})
      }
    } catch (e) {
      // 返回
      return false
    }
  },
  // 判断需要加载的配置文件
  render: async conf => setGlobalData('ZhuChi', conf)
})

// 更新静态配置
export const initDeviceInfo = async _ => {
  // 全局数据对象
  const globalCustomData = global[GLOBAL_KEY]
  // console.log(globalCustomData)
  // 声明
  const { getDeviceInfo } = Container
  // 设备信息
  const DeviceInfo = await getDeviceInfo()
  // 设备信息
  const { Device, AppInfo, conf_futuresApp: { socketConfig: { wsUrl, brokerId } = {} } = {} } = globalCustomData
  // 设备信息
  Object.assign(Device, DeviceInfo)
  // console.log(wsUrl, brokerId)
  // 更新参数信息
  tradeReq.initParams({ Device, AppInfo, brokerId })
  // 路径
  socket.setOptions({ wsUrl: wsUrl })
  // TradeReq.initDeviceParams({ Device, AppInfo, env })
  // 穿透式监管
  // tradeReq.initCollectInfo().catch(e => null)
  // 初始化埋点
  linkTracker.initCommonParams(globalCustomData)
}
