'use strict'

class WS {
  // 构造函数
  constructor(options) {
    // ws对象
    this.ws = null
    // 定时器
    this.timer = 0
    // 配置
    this.options = options
    // 初始化
    this.init()
  }

  // 初始化
  init() {
    // console.log('init')
    // 先关闭再重连
    this.close()
    try {
      // ws
      const ws = new WebSocket(this.options.url)
      // 通讯方式
      ws.binaryType = 'arraybuffer'
      // 赋值
      this.ws = ws
      // 监听
      this.eventInit(ws)
    } catch (e) {
      // console.log('initErr')
      // console.log(e)
      // 错误重连
      this.errorReset()
    }
  }

  // 绑定监听
  eventInit(ws) {
    // 声明
    const { onOpen, onErr, onMsg } = this.options
    // 监听
    ws.onmessage = event => {
      // console.log('message')
      // 重连机制
      this.keepalive()
      // 执行
      typeof onMsg === 'function' && onMsg(event, ws)
    }
    // 链接
    ws.onopen = event => {
      // console.log('open')
      // console.log(event)
      // 重连机制
      this.keepalive()
      // 执行
      typeof onOpen === 'function' && onOpen(event, ws)
    }
    // 报错
    ws.onerror = event => {
      // console.log('error')
      // console.log(event)
      // 重连机制
      typeof onErr === 'function' ? onErr(event, ws) : this.errorReset()
    }
  }

  // 重连
  keepalive() {
    return
    const { timer, options: { heartBeart, timeOut } } = this
    // 清理
    timer && clearTimeout(timer)
    // 重置
    this.timer = setTimeout(_ => {
      // console.log('keepalive_time')
      // 心跳
      typeof heartBeart === 'function' ? heartBeart() : this.errorReset()
      // 重连
    }, timeOut)
  }

  // 断开
  close() {
    // console.log('close')
    const { ws, timer } = this
    // 断开链接
    ws && ws.close()
    // 清理定时器
    timer && clearTimeout(timer)
  }

  // 出错重连
  errorReset() {
    return
    // 断开
    this.close()
    // 重置
    this.timer = setTimeout(_ => this.init(), 2000)
  }
}

export default WS
