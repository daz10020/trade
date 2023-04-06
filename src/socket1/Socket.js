'use strict'
import WS from './WS'
import { logError } from '../utils/tools'
import { setLoginRoute } from '../utils/navigation'
import { Toast } from 'emrn-common/utils/hybrid'
import { reqLogin } from './apis'
import {  tradeReq } from './TradeReq'
import { getGlobalData } from '../conf/tools'

// 通讯
export default class Socket {

  // 构造函数
  constructor(options) {
    // 构建
    Object.assign(this, {
      // ws对象
      ws: null,
      defUrls: {
          test: ' ',
          stage: ' ',
          prod: ' '
      },
      // 配置
      options: options,
      // 登录标记
      hasLogin: false,
      // 参数缓存
      paramsCache: null,
      // 登录失败
      loginReject: null,
      // 交互
      _refreshInfo: null,
      _resetInfo: null
    })
  }

  // 重置连接
  login = async params => {
    // 声明
    const { options: { wsUrl }, url, defUrls, _connect, _reset } = this
    // const { options: { urls }, url, _connect, _reset } = this
    // 没有定位权限
    await tradeReq.initCollectInfo(true)
    // 复位
    _reset()
    // 更新
    // this.url = url || urls[getGlobalData('env')]
    this.url = url || wsUrl || defUrls[getGlobalData('env')]
    // 登录参数
    this.paramsCache = params
    // 更新公共参数中用户信息
    tradeReq.setUserId(params.userId)
    // 连接
    return _connect()
  }

  // 重置连接
  _connect = _ => {
    // console.log('socket__connect')
    // 返回
    return new Promise((resolve, reject) => {
      // 声明
      const { url, _handshake, _heartBeart, _error } = this
      // 报错
      this.loginReject = reject
      // 建立连接
      const ws = new WS({
        // 地址
        url,
        // 接通握手
        onOpen: _ => _handshake().then(resolve),
        // 部署拦截器
        onMsg: tradeReq._responseInterceptors,
        // 报错
        onError: _error,
        // 心跳
        heartBeart: _heartBeart
      })
      // 交易请求
      tradeReq.ws = ws
      // 连接
      this.ws = ws
    })
  }

  // 接通
  _handshake = async _ => {
    // 声明
    const { ws, hasLogin, cacheInfo, paramsCache, _error, _refreshInfo } = this
    try {
      // 握手
      await tradeReq._handshake()
      // 登录
      const info = await reqLogin(paramsCache)
      // 重置重连次数
      ws.resetCount = 1
      // 登录标记
      // !hasLogin ? cacheInfo(info) : await Socket.refreshInfo(info)
      !hasLogin ? cacheInfo(info) : await _refreshInfo(info)
      // 返回结果
      return info
    } catch (e) {
      // 返回错误
      return _error(e)
    }
  }

  // 心跳
  _heartBeart = _ => tradeReq._send({ packType: 0xF, cbKey: -1 })

  // 重置
  _clear = _ => {
    // console.log('socket_clear')
    // 声明
    const { ws } = this
    // 重置
    tradeReq._clear()
    // 断开
    if (!ws) return
    // 断开
    ws._close()
    // 清理
    ws._clearLoading()
    // 重置
    this.ws = null
  }

  _reset = _ => {
    // 创建
    const { hasLogin, paramsCache, _clear } = this
    // 未登录
    if (!hasLogin && !paramsCache) return
    // console.log('socket_reset')
    // 清理状态
    _clear()
    // 更新公共参数中用户信息
    tradeReq.setUserId(undefined)
    // 更新
    Object.assign(this, {
      // 未登录
      hasLogin: false,
      // 清空参数
      paramsCache: null
    })
    // 返回当前对象
    return this
  }

  // 错误处理
  _error = e => {
    // console.log('------------------socket_error------------')
    // console.log(e)
    // 声明
    const { _reset, loginReject, hasLogin, _resetInfo } = this
    // 重置状态
    _reset()
    // 未登录
    if (!hasLogin) return loginReject && loginReject(e)
    // 清空全局状态
    // Socket.resetInfo()
    _resetInfo()
    // 返回登录页面
    setLoginRoute()
    // 超时离线
    if (e !== 'offline') {
      // 错误日志
      logError('Socket.Error', e)
      // 提示连接失败
      Toast.show({ text: '网络连接错误，请稍后重试！' })
    }
    // 触发错误
    return Promise.reject(e)
  }

  // 更新配置
  setOptions = opt => this.options = { ...this.options, ...opt }

  // 更新参数
  cacheInfo = info => {
    // 声明
    const { UserID, Token } = info
    // 参数
    Object.assign(this, {
      // 参数缓存
      paramsCache: { userId: UserID, token: Token, LoginType: '-1' },
      // 登录标识
      hasLogin: true,
      // 复位登录错误
      loginReject: null
    })
  }

  setProps = props => Object.assign(this, props)

}
