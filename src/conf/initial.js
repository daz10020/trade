'use strict'
import { Dimensions, Platform, NativeModules, Text } from 'react-native'
import NavigationService from 'emrn-common/navigation/NavigationService';
import { GLOBAL_KEY } from './constant'
import store from '../store'
import socket from '../socket1'
import { tradeReq } from '../socket1/TradeReq'
import { initHybirdConf, initZhuChiConf, } from './apis'
import { getGlobalData, setGlobalData } from './tools'
import { getLoginState, refreshInfo, refreshLoginState, resetInfo } from '../store/actions/user'
import { receiver, updStore } from '../store/actions/funds'
import quotesCtrl from '../store/QuotesCtrl'
import { cacheInstrument, initInstrument } from './Instrument'
import linkTracker from '../utils/LinkTracker'

const compatibleConf = isRN62 => {
  // 版本
  if (isRN62) {
    const { render, defaultProps } = Text
    Text.render = (props, ref) => render.apply(this, [{
      ...props,
      style: [{ fontFamily: 'PingFang SC' }, props.style]
    }, ref])
    Text.defaultProps = Object.assign({}, defaultProps, { allowFontScaling: false })
  }
}

export const initGlobalConf = _ => {
  // logError('getGlobalData', global[GLOBAL_KEY], 'info')
  // 全局数据对象
  const globalCustomData = {}
  // 全局定义
  global[GLOBAL_KEY] = globalCustomData
  // 机型
  const { OS, constants } = Platform
  const isIos = OS === 'ios'
  // 屏幕尺寸
  const { width, height } = Dimensions.get('screen')
  // isIPad
  const isIPad = NativeModules.PlatformConstants && NativeModules.PlatformConstants.interfaceIdiom === 'pad'
  // rn版本
  const isRN62 = constants && constants.reactNativeVersion && constants.reactNativeVersion.minor === 62
  // 设备信息
  globalCustomData.Device = {
    isIPad, isIos, isRN62,
    isAndroid: OS === 'android',
    isIphoneX: isIos && height === 812 && width === 375 || height === 896 && width === 414,
  }
  // 屏幕参数
  globalCustomData.Screen = {
    width, height,
    statusBarHeight: isIPad ? 30 : 44
  }
  // 初始化
  compatibleConf(isRN62)
  // 码表初始化
  initInstrument()
  // 主次合约码表
  initZhuChiConf()
  // 返回
  return globalCustomData
}

export const initStateConf = async startupParams => {
  // console.log('initStateConf')
  // await delCache(cacheCode)
  // 是否为首次加载
  if (typeof startupParams.appIdx === 'undefined') {
    // 初始化
    await initHybirdConf()
    // 交易函数
    tradeReq._receiver = store.dispatch(receiver)
    // 链接
    socket.setProps({
      // 重连
      _refreshInfo: store.dispatch(refreshInfo),
      // 异常退出登录
      _resetInfo: store.dispatch(resetInfo),
    })
    // 更新函数
    quotesCtrl.init()._setStore = store.dispatch(updStore)
  }
  // 初始化
  const isLogin = await store.dispatch(getLoginState(startupParams))
  // 返回
  return {
    // 是否登录
    isLogin,
  }
}

export const unmountedApp = that => {
  // 声明
  const { appIdx, store } = that
  // 记录参数
  // logError('AppWillUnmount', appIdx, 'info')
  // APPid
  const nid = appIdx - 1
  // console.log(APPidx)
  // 移除页面
  NavigationService.removeTopLevelNavigator()
  // 提交
  linkTracker.submit()
  // 更新
  setGlobalData('appIdx', nid)
  // 移除
  if (!nid) {
    // 中断ws
    socket._clear()
    // 中断sse
    quotesCtrl.clearSSE()
  }
  // 更新
  store.dispatch(refreshLoginState())
  // 缓存码表
  cacheInstrument()
}

