'use strict'
import { AppState } from 'react-native'
import RNEventSource from 'react-native-event-source'

export default class SSE {

  constructor(options) {
    // 初始化
    Object.assign(this, {
      // 配置
      options: null,
      // sse对象
      es: null,
      // 重连次数
      resetNum: 0,
      // 重连次数
      reconnectNum: 0,
      // 定时器
      timer: 0,
    })
  }


  /*
  * 初始化
  *
  * @Param {object} nOpts - 参数
  * @Param {Boolean} [reFlg] -   // 自动重连
  * */
  init = (nOpts, reFlg) => {
    // console.log('sseInit')
    // 声明
    const { close, eventInit, keepalive, errorReset, options: oOpts } = this
    // 配置项
    const options = nOpts || oOpts
    // console.log(nOpts || oOpts)
    // 未配置
    if (!options) return
    // 先关闭再重连
    close()
    // 声明
    const { url, timeout = 20000 } = options
    try {
      // 清理
      !reFlg && keepalive()
      // sse
      const es = new RNEventSource(url, { timeout })
      // 赋值
      Object.assign(this, { es, options })
      // 监听
      eventInit(es)
    } catch (e) {
      // 错误重连
      errorReset()
    }
  }

  // 绑定监听
  eventInit = es => {
    // 声明
    const { options: { onMsg, onOpen, onErr }, reconnect, keepalive, errorReset, msgLimit } = this
    // 监听
    es.addEventListener('message', event => {
      // console.log('message')
      // console.log(event)
      // 置入后台则不更新
      // if (AppState.currentState !== 'active' || msgLimit()) return
      if (AppState.currentState !== 'active') return
      // 执行
      typeof onMsg === 'function' && onMsg(event, es)
    })
    es.addEventListener('open', event => {
      // console.log('open')
      // 重连机制
      keepalive()
      // 执行
      typeof onOpen === 'function' && onOpen(event, es)
    })
    es.addEventListener('error', event => {
      // 重连机制
      keepalive()
      // 重连机制
      typeof onErr === 'function' ? onErr(event, es) : errorReset()
    })
    // 重连
    // reconnect()
  }

  // 重连
  keepalive = _ => {
    // 声明
    const { timer } = this
    // 清理
    timer && clearTimeout(timer)
    // 重置计数
    this.resetNum = 0
  }

  // 断开
  close = _ => {
    // 声明
    const { es, timer } = this
    // 断开链接
    es && es.close()
    // 清理定时器
    timer && clearTimeout(timer)
    // // 移除配置
    // this.options = null
  }

  // 出错重连
  errorReset = _ => {
    // 声明
    const { resetNum, close, init, options: { resetCount = 5 } = {} } = this
    // 断开
    close()
    // 超出则断开
    if (resetNum > resetCount) {
      return this.resetNum = 0
    }
    // 重置
    this.timer = setTimeout(_ => {
      // 重连
      init(false, true)
      // 计数
      this.resetNum++
    }, 10000)
  }

  reconnect = _ => {
    // // 日志
    // logError('SSE.reconnect', this.options)
    // 声明
    const { init, timer, reconnectNum, options: { reconnectCount = 3 } = {} } = this
    // 清理定时器
    timer && clearTimeout(timer)
    // 最多重连次数
    if (reconnectNum > reconnectCount) {
      return this.reconnectNum = 0
    }
    // 重置
    this.timer = setTimeout(_ => {
      // 重连
      init(false, true)
      this.reconnectNum++
    }, 10000)
  }

  msgLimit = _ => {
    // 上次时间
    const { msgTime } = this
    // 当前时间
    const dt = new Date().getTime()
    // 间隔
    const flg = dt - msgTime < 1000
    // 更新
    !flg && (this.msgTime = dt)
    // 间隔
    return flg
  }
}

export const qtSSE = new SSE()
