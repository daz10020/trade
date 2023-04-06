import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import rpx from 'emrn-common/utils/rpx';
import { getColors } from '../style';

export default props => {
  // 样式
  const { tr, th, left } = getCss()
  const { column } = props
  return <View style={tr}>
    {
      column.map((item, idx) => {
        const itemFlg = typeof item === 'object'
        const txt = itemFlg ? item.txt : item
        return <Text key={idx} style={[th, idx === 0 ? left : null, itemFlg ? item.style : null]}>{txt}</Text>
      })
    }
  </View>
}

const getCss = _ => {
  const { lineColor, homeBg } = getColors('lineColor,homeBg')
  return StyleSheet.create({
    tr: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      backgroundColor: homeBg,
      borderBottomColor: lineColor,
      borderBottomWidth: rpx(1),
      marginBottom: rpx(1),
      paddingLeft: rpx(30),
      paddingRight: rpx(30)
    },
    th: {
      lineHeight: rpx(60),
      fontSize: rpx(24),
      color: '#999',
      flex: 1,
      textAlign: 'right'
    },
    left: {
      textAlign: 'left'
    }
  })
}
