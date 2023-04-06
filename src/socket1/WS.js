'use strict'
import EmLoading from 'emrn-common/components/EmLoading';
import {  setDelayTimer, removeDelayTimer } from '../utils/Timer'
import { logError } from '../utils/tools'

class WS {
  // 构造函数
  constructor(options) {
    // 创建
    Object.assign(this, {
      // ws对象
      ws : null,
      // 定时器
      timer : 0,
      // 原生定时器
      nativeTimer : 0,
      // 重连次数
      resetCount : 6,
      // 重发次数
      resendCount : 10,
      // 重发定时器
      resendTimerIds : [],
      // 重连蒙层
      loading : null,
      // 配置
      options : options
    })
    // 初始化
    this.init()
  }

  // 初始化
  init = _ => {
    // console.log('wsinit')
    // 声明
    const { _close, eventInit, errorReset, options: { url } } = this
    // 先关闭再重连
    _close()
    try {
      // ws
      const ws = new WebSocket(url)
      // 通讯方式
      ws.binaryType = 'arraybuffer'
      // 赋值
      this.ws = ws
      // 监听
      eventInit(ws)
    } catch (e) {
      // console.log('initErr')
      // console.log(e)
      // 错误重连
      errorReset(e)
    }
  }

  // 绑定监听
  eventInit = ws => {
    // 声明
    const { options: { onOpen, onClose, onMsg }, _keepalive, _error, _clearLoading } = this
    // 监听
    ws.onmessage = event => {
      // console.log('message')
      // 重连机制
      _keepalive()
      // 执行
      typeof onMsg === 'function' && onMsg(event, ws)
    }
    // 链接
    ws.onopen = async event => {
      // console.log('open')
      // console.log(event)
      // 重连机制
      _keepalive()
      // 执行
      typeof onOpen === 'function' && await onOpen(event, ws)
      // 清理遮罩
      _clearLoading()
    }
    // 断开
    ws.onclose = event => {
      // console.log('onclose')
      // console.log(event)
      // 执行
      typeof onClose === 'function' && onClose(event, ws)
    }
    // 报错
    ws.onerror = event => {
      // console.log('error')
      // console.log(event)
      // console.log(this.ws)
      _error(event, ws)
    }
  }

  // 重连
  _keepalive = _ => {
    // console.log('_keepalive')
    // 声明
    const { _newTimer, options: { heartBeart, onError } } = this
    // 重连
    _newTimer(_ => {
      // console.log('_msgTimeOut')
      // 心跳
      typeof heartBeart === 'function' && heartBeart()
      // 超时报错
      // _newTimer(_ => onError('timeout'))
      // console.log(_newTimer(_ => onError('timeout')))

    })
  }

  // 断开
  _close = _ => {
    // console.log('close')
    // 声明
    const { ws, timer, clearTimer, resendTimerIds } = this
    // 清理定时器
    timer && clearTimeout(timer)
    // 清空
    resendTimerIds.length && resendTimerIds.forEach(timer => clearTimer(timer))
    // 清理
    clearTimer()
    // 初始化
    if (!ws) return
    // 重置
    ws.onerror = null
    ws.onopen = _ => ws.close()
    ws.onmessage = _ => ws.close()
    // 断开链接
    ws.close()
  }

  // 发送消息
  _send = params => {
    // 声明
    const { ws, _send, resendCount, resendTimerIds } = this
    // 已连接
    if (ws.readyState === WebSocket.OPEN) {
      // 有延时
      if (resendCount > 0) {
        // 重置
        this.resendCount = 0
      }
      // 发送
      ws && ws.send(params)
    } else if (ws.readyState === WebSocket.CONNECTING) {
      // 叠加
      ++this.resendCount
      // 延时发送
      const timer = setTimeout(_ => {
        // 移除id
        this.resendTimerIds = resendTimerIds.filter(id => id !== timer)
        // console.log(this.resendTimerIds)
        // 执行
        _send(params)
      }, 100)
      // console.log(resendTimerIds)
      // 添加
      this.resendTimerIds.push(timer)
    }
  }

  // 出错重连
  _error = e => {
    // 日志
    logError('WS.ErrorReset', e)
    // 声明
    const { _close, resetCount, init, _clearLoading, loading, options: { onError } } = this
    // 断开
    _close()
    // 超出则断开
    if (resetCount > 5) {
      // 清理蒙层
      _clearLoading()
      // 返回错误
      return onError(e)
    }
    // 蒙层
    !loading && (this.loading = EmLoading('重新连接中'))
    // 记录断线时间
    const eTime = new Date().getTime()
    // 重置
    this.timer = setTimeout(_ => {
      // 断线5分钟
      if (new Date().getTime() - eTime > 5 * 60 * 1000) {
        // 清理蒙层
        _clearLoading()
        // 返回错误
        return onError('offline')
      }
      // 重连
      init()
      // 计数
      this.resetCount++
    }, resetCount * 5000 + 60)
  }

  // 清理蒙层
  _clearLoading = _ => {
    this.loading && this.loading.destroy()
    this.loading = null
  }

  clearTimer = _ => {
    // 清理
    removeDelayTimer(this.nativeTimer)
  }

  _newTimer = func => {
    // 声明
    const { options: { timeOut = 10 }, clearTimer } = this
    // 清理
    clearTimer()
    // 更新
    this.nativeTimer = setDelayTimer(_ => {
      // 回调
      typeof func === 'function' && func()
    }, timeOut)
  }
}

export default WS
