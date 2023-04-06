'use strict'

import { LocalStorage } from 'emrn-common/utils/hybrid'
import { CACHE_PREFIX, USERS_CACHE_KEY } from '../conf/constant'
import { logError } from './tools'

/**
 * 获取缓存
 *
 * @param {string} key - 缓存名称
 *
 * @returns {Promise<object>}
 *
 */
export const getCache = async key => {
  // 数据
  const { data } = await LocalStorage.get({name: `${CACHE_PREFIX}${key}`})
  try {
    // console.log(`getCache: ${CACHE_PREFIX}${key}`)
    // 格式化
    return data ? JSON.parse(data) : data
  } catch (e) {
    // 日志
    logError(`getCache：${key}`, e)
    // 返回空
    return data
  }
}

/**
 * 添加缓存
 *
 * @param {string} key - 缓存名称
 * @param {object/string} data - 缓存数据
 * @param {function} [error_cb] - 错误回调
 *
 * @returns {Promise<object>}
 *
 */
export const setCache = async (key, data) => LocalStorage.set({
  name :`${CACHE_PREFIX}${key}`,
  data: typeof data === 'object' ? JSON.stringify(data) : data
})

/**
 * 清理缓存
 *
 * @param {string} key - 缓存名称
 *
 * @returns {Promise<object>}
 *
 */
export const delCache = key => LocalStorage.remove({name: `${CACHE_PREFIX}${key}`})

// 本地存储用户信息
export const setUsersCache = userList => setCache(USERS_CACHE_KEY, { userList, timestamp: new Date().getTime() })
export const getUsersCache = _ => getCache(USERS_CACHE_KEY)
