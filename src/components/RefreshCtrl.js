import React, { PureComponent } from 'react'
import { RefreshControl } from 'react-native'

export default class RefreshCtrl extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  handleRefresh = _ => {
    // 开始重载
    this.setState({ refreshing: true })
    // 刷新
    this.props.onRefresh().then(_ => {
      // 重置
      this.setState({ refreshing: false })
    })
  }

  render() {
    const { state: { refreshing }, handleRefresh } = this
    // console.log(this.props)
    return <RefreshControl enabled={!refreshing} refreshing={refreshing} onRefresh={handleRefresh}/>
  }
}
