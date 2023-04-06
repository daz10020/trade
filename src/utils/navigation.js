'use strict'

import { Platform } from 'react-native'
import { Router, Download, Compat } from 'emrn-common/utils/hybrid'
import NavigationService from 'emrn-common/navigation/NavigationService'
import { trackEvent, logError } from './tools'
import { StackActions, NavigationActions } from 'react-navigation'
import { getGlobalData } from '../conf/tools'
import linkTracker from './LinkTracker'

const { OS } = Platform


class JumpLink {

  constructor() {
    // 跳转标记
    this.jumping = false
    // 定时器
    this.timer = 0
  }

  // 重置
  resetJumpFlg = _ => {
    // 声明
    const { timer, jumping } = this
    // 清理
    timer && clearTimeout(timer)
    // 返回延迟对象
    return new Promise(resolve => this.timer = setTimeout(_ => {
      this.jumping = false
      resolve()
    }, 400))
  }

  // 短链跳转
  openDeepLink = async (linkUrl, trackName) => {
    // 声明
    const { jumping, resetJumpFlg } = this
    // 防止重复点击
    if (jumping || !linkUrl) return
    // 标记位
    this.jumping = true
    // 格式化
    const deepLink = typeof linkUrl === 'object' ? linkUrl[OS] : linkUrl
    try {
      // 跳转
      await Router.openDeepLink({ deepLink })
      // 埋点
      trackName && trackEvent(trackName, { deepLink })
    } catch (e) {
      logError(`jump: ${deepLink}`, e)
    } finally {
      // 重置
      return resetJumpFlg()
    }
  }


  // 打开期货
  openQh = async (options, trackName) => {
    // 声明
    const { jumping, resetJumpFlg } = this
    // 防止重复点击
    if (jumping || !options) return
    // 标记位
    this.jumping = true
    // 声明
    const { linkUrl, download, packageName = '' } = options
    // 格式化
    const url = typeof linkUrl === 'object' ? linkUrl[OS] : linkUrl
    // 格式化
    const deepLink = `${OS === 'android' ? '' : ''}${url}`
    // 埋点
    trackName && trackEvent(trackName, { deepLink })
    try {
      // 跳转
      const { isInstall } = await Router.openApp({ packageName, scheme: deepLink }) || {}
      // 已下载
      if (isInstall) return
      // // 配置
      // const { category, linkUrl } = getCMSConf('gdData')
      // // 安卓处理
      // if (OS === 'android' && category === 2 && Number(getGlobalData('AppInfo').appVersionCode) > 9007000) {
      //   // 应用商店
      //   await Router.openAppStoreWithId({ packageName, scheme: deepLink })
      // } else if (OS === 'ios' || !category) {
      //   // 下载
      //   await Router.openH5({ url: download || linkUrl, requestResult: true })
      // } else if (category === 1) {
      //   // 下载
      //   await Download.download({ url: download, mineType: 'application/vnd.android.package-archive', contentDisposition: '' })
      // } else {
        await Router.openH5({ url: download || linkUrl, requestResult: true })
      // }
    } catch (e) {
      logError(`jump: ${url}`, e)
    } finally {
      // 重置
      return resetJumpFlg()
    }
  }

  /**
   * 跳转方法封装
   *
   * @param {Object} options 跳转配置
   * @param {Number} options.linkType - 链接性质 1-H5|2-短链|3-RN
   * @param {String} options.linkUrl - 链接路径
   * @param {Object} options.[params] - 附加参数
   * @param {String} options.[method] - 跳转方式 默认'navigate' 可选: 'replace'
   * @param {String} [trackName] 埋点名称
   *
   * @returns {Function} 返回销毁函数
   * */
  jumpUrlFunc = async (options, trackName) => {
    // 声明
    const { jumping, openDeepLink, resetJumpFlg, openQh } = this
    // 防止重复点击
    if (jumping) return
    // 声明
    const { linkType, linkUrl, params = null, cb, method = 'navigate' } = options
    // 埋点
    trackName && trackEvent(trackName, options)
    // 初始化埋点
    linkTracker.add(options)
    // 标记位
    this.jumping = linkType === 3
    // 格式化
    const url = typeof linkUrl === 'object' ? linkUrl[OS] : linkUrl
    try {
      // 声明
      let res
      // 打开H5页面
      if (linkType === 1) {
        // 回调
        res = await Router.openH5({ url, requestResult: true })
      } else if (linkType === 2) { // 打开APP页面
        res = await openDeepLink(url)
      } else if (linkType === 3) { // 打开RN页面
        // 跳转
        res = await NavigationService[method]({ routeName: url, params })
        // 重置
        await resetJumpFlg()
      } else if (linkType === 4) { // 打开期货
        // 重置
        await openQh(options)
      }
      // 跳转
      typeof cb === 'function' && cb(res)
    } catch (e) {
      logError(`jump: ${url}`, e)
    } finally {
      // 重置标记
      this.jumping = false
    }
  }
}

// 创建
const jumpLink = new JumpLink()

export const openQh = jumpLink.openQh
export const openDeepLink = jumpLink.openDeepLink
export const jumpUrlFunc = jumpLink.jumpUrlFunc


/**
 * 跳转至登录页面
 *
 * @param {Object} [params] 传递参数
 *
 * */
export const setLoginRoute = params => {
  // 声明
  const { getTopLevelNavigator } = NavigationService
  // 当前页
  const navigation = getTopLevelNavigator()
  // 未创建
  if (!navigation) return
  // 当前路由
  const { state: { nav: { routes = [] } = {} } } = navigation
  // 长度
  const { length } = routes
  // 跳转至登录
  if (!length) return navigation.dispatch(StackActions.push({
    routeName: 'Login', params
  }))
  // 当前为登录则返回
  if (routes[length - 1].routeName === 'Login') return
  // 重设路由
  navigation.dispatch(StackActions.reset({
    index: 0,
    actions: [
      // NavigationActions.navigate({ routeName: 'Home' }),
      NavigationActions.navigate({ routeName: 'Login', params }),
    ]
  }))
}

/**
 * 重置
 *
 * @param {Object} [params] 传递参数
 *
 * */
export const resetRoute = _ => {
  // 声明
  const { getTopLevelNavigator } = NavigationService
  // 当前页
  const navigation = getTopLevelNavigator()
  // 未创建
  if (!navigation) return
  // 初始变量
  const { page } = getGlobalData('StartupParams') || {}
  // 页面名称
  const routeName = page && String(page) !== 'Login' ? page : 'Main'
  // 重设路由
  navigation.dispatch(StackActions.reset({
    index: 0,
    actions: [
      // NavigationActions.navigate({ routeName: 'Home' }),
      NavigationActions.navigate({ routeName }),
    ]
  }))
  // 返回
  return routeName
}

// 点击跳转
export const toQuotesFunc = (quotes, trackCode) => {
  // 期货安卓
  const { appType, appVersionCode } = getGlobalData('AppInfo')
  // 声明
  const { EMInstumentID, ExchangeID, InstrumentName, InstrumentID } = quotes
  // id
  let uid = `${ExchangeID}|${InstrumentID}`
  // 名称
  let name = InstrumentName
  // 中金所
  if (ExchangeID === 'CFFEX' && Number(appVersionCode) < '10005000') {
    // id
    uid = `SF${EMInstumentID}`
    // 名称
    name = InstrumentID
  }
  // 生成
  const opt = appType === 'qhb' ? {
    ios: `?code=${encodeURIComponent(uid)}`,
    android: `${uid}`
  } : {
    ios: `${encodeURIComponent(uid)}&name=${encodeURIComponent(name)}`,
    android: `=${uid}&stockname=${name}`
  }
  // 埋点
  const trackStr = trackCode || 'toQuotes'
  // 返回函数
  return _ => openDeepLink(opt, trackStr)
}
