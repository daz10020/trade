import React, { Component } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import FundsDetail from '../FundsDetail'
import PositionsList from '../Positions'
import { getColors } from '../../style'
import rpx from 'emrn-common/utils/rpx'

export default class FundsTab extends Component {
  constructor(props) {
    super(props)
    // 样式
    this.wrapStyle = getCss()
  }

  render() {
    const { props: { Positions, Funds, submitOrder, getPositions, getFunds }, wrapStyle } = this
    // console.log(Funds)
    return <ScrollView
      // style={{flex: 1}}
      // contentContainerStyle={wrapStyle}
      refreshControl={<RefreshControl refreshing={false} onRefresh={getFunds}/>}
    >
      <View style={wrapStyle}>
        <FundsDetail Funds={Funds}/>
        <PositionsList
          Positions={Positions}
          Funds={Funds}
          getPositions={getPositions}
          submitOrder={submitOrder}
        />
      </View>
    </ScrollView >
  }
}

const getCss = _ => {
  // 颜色
  const homeBg = getColors('homeBg')

  return {
    flex: 1,
    backgroundColor: homeBg,
    borderTopLeftRadius: rpx(12),
    borderTopRightRadius: rpx(12)
  }
}
