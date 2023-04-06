import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TextDIY from '../TextDIY'
import { getColors } from '../../style';
import rpx from 'emrn-common/utils/rpx';
import ButtonDIY from '../ButtonDIY'
import List from '../List'
import { EmAlert } from 'emrn-common/components';
import { delOrder } from '../../socket1/apis'

export default class DealList extends Component {
  constructor(props) {
    super(props)
    this.styles = getCss()
    // 表头
    this.titleArr = ['时间/合约', '状态/开平', '委价/委量', '未成/已成']
  }

  // 撤单
  _closeCancel = item => _ => {
    // 声明
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
    const { tr, col, colLeft, last, txt, cancel, cancelTxt, noCancelBg, noCancelColor, red, green, blue, tip } = styles
    // 持仓列表
    const { list, onRefresh } = props
    // 渲染
    return <List
      list={list}
      thead={titleArr}
      keyExtractor={item => item.id}
      onRefresh={onRefresh}
      tipTxt={'当日委托'}
      renderItem={({ item }) => {
        const {
          InsertTime, orderStatusName, LimitPrice, VolumeTotal,
          ClientInstrumentName, combOffsetFlag, direction, directionName, VolumeTotalOriginal, VolumeTraded, canRevokeFlg
        } = item
        return <View style={tr}>
          <View style={[col, colLeft]}>
            <Text style={txt}>{InsertTime}</Text>
            <TextDIY style={txt} fz={28} upper={50}>{ClientInstrumentName}</TextDIY>
          </View>
          <View style={col}>
            <Text style={txt}>{orderStatusName}</Text>
            {/*颜色(0 0买开红色, 0 1卖开绿色, 平仓蓝色)*/}
            <Text style={[txt, combOffsetFlag === 0 ? direction === 0 ? red : green : blue]}>{directionName}</Text>
          </View>
          <View style={col}>
            <Text style={txt}>{LimitPrice}</Text>
            <Text style={txt}>{VolumeTotalOriginal}</Text>
          </View>
          <View style={[col, last]}>
            <View>
              <Text style={txt}>{VolumeTotal}</Text>
              <Text style={txt}>{VolumeTraded}</Text>
            </View>
            <ButtonDIY
              title={'撤'}
              onClick={_closeCancel(item)}
              btnStyle={[cancel, canRevokeFlg ? null : noCancelBg]}
              txtStyle={[cancelTxt, canRevokeFlg ? null : noCancelColor]}/>
          </View>
        </View>
      }}
    />
  }
}

const getCss = _ => {
  // 颜色
  const { txt, z, d, blue, dis } = getColors('z,d,blue,txt,dis')

  return StyleSheet.create({
    tr: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingLeft: rpx(30),
      paddingRight: rpx(30)
    },
    left: {
      textAlign: 'left'
    },
    col: {
      flex: 1,
      alignItems: 'flex-end',
    },
    colLeft: {
      alignItems: 'flex-start',
    },
    txt: {
      color: txt,
      fontSize: rpx(28),
      lineHeight: rpx(56),
      fontFamily: 'PingFangSC-Medium',
      fontWeight: 'bold'
    },
    cancel: {
      marginLeft: rpx(15),
      width: rpx(50),
      height: rpx(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: rpx(4),
      borderWidth: rpx(2),
      borderColor: blue
    },
    cancelTxt: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(30),
      color: blue,
    },
    noCancelBg: {
      backgroundColor: dis,
      borderColor: dis
    },
    noCancelColor: {
      color: '#fff'
    },
    last: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    red: {
      color: z
    },
    green: {
      color: d
    },
    blue: {
      color: blue
    },
  })
}
