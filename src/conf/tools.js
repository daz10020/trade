'use strict'

import { getCache, setCache, delCache } from '../utils/cache'
import { logError } from '../utils/tools'
import { propsTypeValidator } from '../utils/validate'
import confTypesModules from './confTypes/index'
import { VSN, CONFIG_CACHE_PREFIX, GLOBAL_KEY } from './constant'

/*
* 获取全局变量
* @params keys 变量名称，以,分割
* */
export const getGlobalData = keys => {
  // 全局变量
  const { [GLOBAL_KEY]: gb } = global
  // 空
  if (!keys) return gb
  // 同时获取多个
  const ks = keys.replace(/\s/g, '').split(',')
  // 一个
  if (ks.length === 1) {
    // 直接返回
    return gb[ks[0]]
  } else {
    // 声明
    const res = {}
    // 遍历
    ks.forEach(key => {
      res[key] = gb[key]
    })
    // 返回汇总对象
    return res
  }
}

/*
* 设置全局变量
* @params keys    变量名称，以 .表示层级结构
* @params value   变量值
* */
export const setGlobalData = (key, value) => {
  // 空
  if (!key) return
  // 分割
  const ks = key.split('.')
  if (ks.length === 1) {
    // 更新
    global[GLOBAL_KEY][key] = value
  } else {
    // 声明
    let temp = global[GLOBAL_KEY]
    // 遍历
    for (let i = 0, l = ks.length; l < len; i++) {
      // key
      const key = ks[i]
      const obj = temp[key]
      // 目标对象
      if (i === l - 1) {
        temp[key] = value
      } else if (obj && typeof obj === 'object') {
        // 对象类型继续解析
        temp = obj
      } else {
        new Error(`[${key}] is not object`)
      }
    }
  }
}


/*
* 获取配置信息
*
* @Param {object} request
* @Param {string} request.api - 页面key
* @Param {Func} request.getConf - 获取远程配置
* @Param {Func} request.render - 获取配置后的渲染函数
* @Param {Func} request.delay - 延时加载
* */
export const getSingleConf = async request => {
  // 声明
  const { api, getConf, render, delay = 5000 } = request
  try {
    // 缓存code
    const cacheCode = `${CONFIG_CACHE_PREFIX}.${api}`
    // await delCache(cacheCode)
    // 获取本地缓存
    const { version, ...cacheData } = await getCache(cacheCode) || {}
    // 判断是否可用
    const conf = VSN === version ? cacheData : false
    // 执行渲染
    const hasRender = conf && delay && await render(conf)
    // 集合
    const opts = { getConf, cacheCode, render, api, hasRender, oldCache: conf }
    // 延迟加载配置
    delay && hasRender ? setTimeout(_ => getSingleDynamicConf(opts), delay) : await getSingleDynamicConf(opts)
  } catch (e) {
    logError(`getSingleConf: ${api}`, e)
  }
}


// 获取最新配置信息
const getSingleDynamicConf = async options => {
  try {
    // 声明
    const { hasRender, getConf, cacheCode, render, api, oldCache } = options
    // 获取线上配置
    const dynamicConf = await getConf(oldCache) || {}
    // 验证格式
    const isValid = dynamicConf && propsTypeValidator(dynamicConf, confTypesModules[api])
    // 首次加载
    !hasRender && await render(isValid ? dynamicConf : oldCache, options)
    // 未变化或不合法
    if (!isValid || oldCache && oldCache.MD5 === dynamicConf.MD5) return
    // 缓存
    await setCache(cacheCode, { ...dynamicConf, version: VSN })
  } catch (e) {
    logError('getSingleDynamicConf', e)
  }
}

