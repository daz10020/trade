import { StyleSheet, Text, TouchableWithoutFeedback, View, FlatList } from 'react-native';
import React, { Component } from 'react';
import { getColors } from '../../style';
import rpx from 'emrn-common/utils/rpx';
import List from '../List'
import TextDIY from '../TextDIY';


export default class DealList extends Component {
  constructor(props) {
    super(props)
    this.styles = getCss()
    this.titleArr = ['合约名称', '开平', '成交价', '成交量', '成交时间']
  }

  render() {
    // 声明
    const { styles, props, titleArr } = this
    // 样式
    const { tr, td, red, green, blue, left } = styles
    // 持仓列表
    const { list, onRefresh } = props
    // 渲染
    return <List
      thead={titleArr}
      list={list}
      onRefresh={onRefresh}
      keyExtractor={item => item.TradeID}
      tipTxt={'当日成交'}
      renderItem={({ item }) => {
        const { _price, ClientInstrumentName, direction, offsetFlag, directionName, Volume, TradeTime } = item
        return <TouchableWithoutFeedback>
          <View style={tr}>
            <TextDIY style={[td, left]} fz={28} upper={40}>{ClientInstrumentName}</TextDIY>
            <Text
              style={[td, offsetFlag === 0 ? direction === 0 ? red : green : blue]}>{directionName}</Text>
            <Text style={td}>{_price}</Text>
            <Text style={td}>{Volume}</Text>
            <Text style={td}>{TradeTime}</Text>
          </View>
        </TouchableWithoutFeedback>
      }}
    />
  }

}

const getCss = _ => {
  // 颜色
  const { txt, z, d, blue } = getColors('z,blue,d,txt,lineColor')

  return StyleSheet.create({
    tr: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      height: rpx(80)
    },
    td: {
      color: txt,
      fontSize: rpx(28),
      lineHeight: rpx(56),
      flex: 1,
      // width: '25%',
      textAlign: 'right',
      fontFamily: 'PingFangSC-Medium',
      fontWeight: 'bold',
      // textAlignVertical: 'center'
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
