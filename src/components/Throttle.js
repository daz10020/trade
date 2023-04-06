import React, { Component } from 'react'

export default Element => class extends Component {
  constructor(props) {
    super(props)
    // 缓冲区定时器
    this.timer = 0
    // 更新间隔
    this.interval = props.interval || 1000
    // 下次更新时间
    this.needUpd = false
    // 状态
    this.state = {
      updFlg: 0
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // 更新
    return nextState.updFlg !== this.state.updFlg
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // console.log('----------componentWillReceiveProps--------------')
    // console.log(nextProps)
    // console.log(this.timer)
    // 定时器
    const { timer, _validUpd, interval } = this
    // 存在延时
    if (timer) {
      // 需要更新
      return this.needUpd = true
    }
    // 设置定时器
    this.timer = setInterval(_validUpd, interval)
    // 立即执行
    this.setState({ updFlg: new Date().getTime() })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  // 检测更新
  _validUpd = _ => {
    // 声明
    const { needUpd, timer } = this
    // 无需更新
    if (needUpd) {
      // 重置
      this.needUpd = false
      // 更新
      return this.setState({ updFlg: new Date().getTime()})
    }
    // 清理
    clearInterval(timer)
    // 重置
    this.timer = 0
  }

  render() {

    const { state: { updFlg }, props } = this
    // console.log('-----------------Throttle Render---------------')
    // console.log(props)

    return <Element {...props} updFlg={updFlg}/>
  }
}
