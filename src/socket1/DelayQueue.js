'use strict'

export default class DelayQueue {

  constructor(options) {
    // 声明
    const { items = [], space = 1000, delay = 0, func = _ => null } = options || {}
    // 更新
    Object.assign(this, {
      // 队列
      items,
      // 超时
      space,
      // 延时
      delay,
      // 执行
      func,
      // 超时检查计时器
      timer: 0
    })
  }

  // 入列
  enqueue = (nid, options, cancel) => {
    // 声明
    const { items, delay, timer, _autoRequest } = this
    // 防止重复请求
    if (items.some(({ id }) => id === nid)) return cancel('queueCancel')
    // 添加队列
    items.push({ id: nid, options, time: new Date().getTime() })
    // 检查定时器
    if (timer) return
    // 更新时间
    this.preTime = new Date().getTime()
    // 定时器
    this.timer = setTimeout(_ => _autoRequest(true), delay)
  }

  // 检测
  _autoRequest = isFst => {
    // 声明
    const { items, space, delay, _autoRequest, dequeue, func, preTime } = this
    // 当前时间
    const dt = new Date().getTime()
    // 对比
    const calcTime = dt - preTime
    // 误差
    const nErrorNum = (!isFst && calcTime < space ? space : isFst && calcTime < delay ? delay : calcTime) - calcTime
    // 如果间隔不足，则新建定时器
    if(nErrorNum) return this.timer = setTimeout(_ => _autoRequest(isFst), 2 * nErrorNum)
    // 立即执行
    const { options, time } = dequeue()
    // 执行
    func(options)
    // 间隔
    const s = Math.max(new Date().getTime() - delay - time, space)
    // 更新时间
    this.preTime = new Date().getTime()
    // 设置定时器
    this.timer = items.length ? setTimeout(_autoRequest, s + nErrorNum) : 0
  }

  // 出列
  dequeue = _ => {
    // 声明
    const { items } = this
    // 移除
    return items.shift();
  }

  _clear = _ => {
    // 声明
    const { timer } = this
    // 停止定时器
    timer && clearTimeout(timer)
    // 重置
    Object.assign(this, {
      items: [],
      timer: 0,
    })
  }

  get size() {
    return this.items.length;
  }

  get isEmpty() {
    return !this.items.length;
  }

}

