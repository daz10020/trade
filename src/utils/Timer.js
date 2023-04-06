'use strict'

import { invoke } from 'emrn-common/utils/hybrid'
import { GLOBAL_KEY } from '../conf/constant'

class DelayTimer {
  // 构造函数
  constructor() {
    // ws对象
    this.delayTimerId = 0
  }

  /**
   * 定时器
   *
   * @param {Object} options - 字体大小
   * @param {String} options.id - 定时器ID
   * @param {Number} options.delayTime - 延时（秒）
   *
   * @return {String, Number} timerId - 定时器ID
   * */
  setDelayTimer = (cb, delayTime) => {
    // 声明
    const delayTimerId = ++this.delayTimerId
    // return setTimeout(_ => {
    //   // 执行
    //   typeof cb === 'function' && cb()
    // }, delayTime)
    // 定时器id
    const timerId = `${GLOBAL_KEY}_Timeout_${delayTimerId}`
    // 调用
    invoke('Container', 'setDelayTimer', {
      id: timerId, delayTime
    }).then(res => {
      // 异常或取消
      if (!res || res.isCancel) return
      // 执行
      typeof cb === 'function' && cb()
    })
    // 返回
    return timerId
  }

  /**
   * 移除定时器
   *
   * @param {String, Number} id - 定时器ID
   *
   * */
  removeDelayTimer = id => invoke('Container', 'removeDelayTimer', { id })
  // removeDelayTimer = id => clearTimeout(id)
}

// 定时器
const timer = new DelayTimer()

export const setDelayTimer = timer.setDelayTimer
export const removeDelayTimer = timer.removeDelayTimer

