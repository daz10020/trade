import { StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import TextDIY from '../TextDIY'
import { getColors } from '../../style'
import rpx from 'emrn-common/utils/rpx'
import ActList from './ActList'
import EmAlert from 'emrn-common/components/EmAlert'
import { delOrder } from '../../socket1/apis'


export default class CanRevokeList extends Component {
  constructor(props) {
    super(props)
    this.styles = getCss()
    this.titleArr = ['合约', '开平', '委托价', '委托量', '挂单量']
  }

  // 撤单
  _closeCancel = item => {
    // console.log(item)
    const { ClientInstrumentName, directionName, LimitPrice, VolumeTotal, canRevokeFlg } = item
    // 不可撤单
    if (!canRevokeFlg) return
    // 提示
    EmAlert({
      title: `撤单确认`,
      message: <View>
        <Text>合约名称：{ClientInstrumentName}</Text>
        <Text>交易方向：{directionName}</Text>
        <Text>合约价格：{LimitPrice}</Text>
        <Text>撤单数量：{VolumeTotal}</Text>
      </View>,
      buttons: ['取消', '确定'],
      onOk: _ => delOrder(item)
    })
  }

  render() {
    // 声明
    const { styles, props, titleArr, _closeCancel } = this
    // 样式
    const { tr, td, txt, red, green, blue, left } = styles
    // 持仓列表
    const { list, onRefresh } = props
    // 渲染
    return <ActList
      list={list.filter(({ canRevokeFlg }) => canRevokeFlg)}
      thead={titleArr}
      onRefresh={onRefresh}
      // btns={[{ title: '撤单', onClick: _closeCancel }]}
      leftBtn={{ title: '撤单', onClick: _closeCancel }}
      tipTxt={'挂单'}
      Item={item => {
        const { LimitPrice, ClientInstrumentName, direction, combOffsetFlag, directionName, VolumeTotalOriginal, VolumeTotal } = item
        return <View style={tr}>
          <TextDIY style={[td, txt, left]}>{ClientInstrumentName}</TextDIY>
          <Text style={[td, txt, combOffsetFlag === 0 ? direction === 0 ? red : green : blue]}>{directionName}</Text>
          <Text style={[td, txt]}>{LimitPrice}</Text>
          <Text style={[td, txt]}>{VolumeTotalOriginal}</Text>
          <Text style={[td, txt]}>{VolumeTotal}</Text>
        </View>
      }}
    />
  }
}

const getCss = _ => {
  // 颜色
  const { txt, blue, z, d } = getColors('blue,txt,z,d')

  return StyleSheet.create({
    tr: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingLeft: rpx(30),
      paddingRight: rpx(30)
    },
    td: {
      flex: 1
    },
    txt: {
      color: txt,
      fontSize: rpx(28),
      lineHeight: rpx(56),
      textAlign: 'right',
      fontFamily: 'PingFangSC-Medium',
      fontWeight: 'bold'
    },
    left: {
      textAlign: 'left'
    },
    red: {
      color: z
    },
    green: {
      color: d
    },
    blue: {
      color: blue
    }
  })
}
