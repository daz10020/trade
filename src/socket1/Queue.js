import { Toast } from 'emrn-common/utils/hybrid';
import { logError } from "../utils/tools";

export default class Queue {

  constructor(options) {
    // 声明
    const { items = {}, timeOuts = {} } = options || {}
    // 队列
    this.items = items
    // 超时
    this.timeOuts = timeOuts
    // 数量
    this.total = 0
    // 超时检查计时器
    this.timer = 0
  }

  // 入列
  enqueue = options => {
    // 声明
    const { items, _fmtId, _setTimeout, total } = this
    // 请求参数
    const { messageID, packType = 1, onSuccess, onError, cbKey, reqConf } = options
    // 请求id
    const packid = cbKey || total + 1
    // 回调id
    const cbId = _fmtId(packid)
    // 添加回调(心跳包除外)
    if (onSuccess || onError) {
      // 更新
      this.total = total + 1
      // 录入超时队列
      _setTimeout(cbId, options)
      // 回调队列
      items[cbId] = {
        onSuccess, onError, reqConf,
        // 是否为业务包
        isSpecial: packType !== 1 && packType !== 2,
        _packType: packType,
        _messageID: messageID
      }
    }
    // 返回id
    return packid
  }

  // 出列
  dequeue = packid => {
    // 生成id
    const { _fmtId, items, timeOuts } = this
    // 回调id
    const cbId = _fmtId(packid)
    // 查询
    const res = items[cbId]
    // 移除回调信息
    delete items[cbId]
    // 移除超时监听
    delete timeOuts[cbId]
    // 返回结果
    return res
  }

  // 统一id格式
  _fmtId = id => `cb_${id}`

  // 设置超时检查
  _setTimeout = (cbId, options) => {
    // 声明
    const { timeOuts, timer, _isTimeout } = this
    // 声明
    const { onError, messageID } = options
    // 无错误处理或报单接口，忽略超时问题
    if (!onError || /^2000/.test(messageID)) return
    // 录入队列
    timeOuts[cbId] = 4
    // 检查定时器
    if(timer) return
    // 设置定时器
    this.timer = setInterval(_isTimeout, 3333)
    // console.log(this.timer)
  }

  // 检测
  _isTimeout = _ => {
    // 队列
    const { timeOuts, items, timer } = this
    // 更新
    Object.keys(timeOuts).forEach(id => {
      // 剩余值
      const val = timeOuts[id] - 1
      // 扣除
      if (val) return timeOuts[id] = val
      // 声明
      const { onError, reqConf: { hideTimeoutMsg } = {} } = items[id]
      // 日志
      logError('timeout', items[id])
      // 移除
      delete timeOuts[id]
      // 移除
      delete items[id]
      // 返回错误
      onError('timeOut')
      // 默认提示消息
      !hideTimeoutMsg && Toast.show({ text: '请求超时，请重试！' })
    })
    // 移除
    if (!Object.keys(timeOuts).length) {
      // 清理
      clearInterval(timer)
      // 重置
      this.timer = 0
    }
  }

  _clear = _ => {
    // 声明
    const { timer } = this
    // 停止定时器
    timer && clearInterval(timer)
    // 重置
    Object.assign(this, {
      items: {},
      timeOuts: {},
      timer: 0
    })
  }

  get size() {
    return this.items.length;
  }

  get isEmpty() {
    return !this.items.length;
  }

}

