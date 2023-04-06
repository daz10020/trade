import { setDelayTimer, removeDelayTimer } from '../utils/Timer'

export default class RequestQueue {

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
  enqueue = options => {
    // 声明
    const { items, space, timer, _autoRequest, func } = this
    // 检查定时器
    if (timer) return items.push(options)
    // 立即执行
    func(options)
    // 定时器
    this.timer = setDelayTimer(_autoRequest, Number(space))
  }

  // 检测
  _autoRequest = _ => {
    // 声明
    const { space, func, _autoRequest, dequeue, timer } = this
    // 立即执行
    const nextOpt = dequeue()
    // 更新
    if (!nextOpt) return this.timer = 0
    // 执行
    func(nextOpt)
    // // 移除
    // timer && removeDelayTimer(timer)
    // 设置定时器
    this.timer = setDelayTimer(_autoRequest, Number(space))
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
    timer && removeDelayTimer(timer)
    // 重置
    Object.assign(this, {
      items: [],
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

