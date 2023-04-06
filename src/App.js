import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import AppNavigation from './AppNavigation'
import 'emrn-common/settings/Text/index'
import { logError } from './utils/tools'
import { initGlobalConf, initStateConf, unmountedApp } from './conf/initial'
import { getGlobalData, setGlobalData } from './conf/tools'

// 兼容
initGlobalConf()

export default class App extends React.Component {
  constructor(props) {
    // 创建
    super(props)
    // APPid
    const oidx = getGlobalData('appIdx')
    // 新增
    const nidx = (oidx || 0) + 1
    // 更新
    setGlobalData('appIdx', nidx)
    // 启动参数
    const startupParams = { ...props, appIdx: oidx }
    // 初始变量
    setGlobalData('StartupParams', startupParams)
    // 记录参数
    logError('StartupParams', startupParams, 'info')
    // 创建
    Object.assign(this, {
      // 全局状态
      store,
      // 界面id
      appIdx: nidx,
      // 基本状态
      state: {
        varConf: null
      }
    })
    // 更新
    initStateConf(startupParams).then(async varConf => {
      // // 声明
      // const {  clearLis, ...varConf } = res
      // // 更新
      // Object.assign(this, { clearLis })
      // 更新
      this.setState({ varConf })
    })
  }

  componentWillUnmount() {
    // console.log('AppWillUnmount')
    // 回收
    unmountedApp(this)
  }

  render() {
    // 声明
    const { state: { varConf }, props, store } = this
    // 初始化
    return !varConf ? null : <Provider store={store}>
      <AppNavigation {...props} varConf={varConf}/>
    </Provider>
  }
}
