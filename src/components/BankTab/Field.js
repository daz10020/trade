import React from 'react'
import rpx from 'emrn-common/utils/rpx'
import { getColors } from '../../style'
import { View, Text, StyleSheet } from 'react-native';

export default props => {
  const { title, children } = props
  // 样式
  const { tr, tit, right } = getCss()
  return <View style={tr}>
    <Text style={tit}>{title}</Text>
    <View style={right}>{children}</View>
  </View>
}

const getCss = _ => {
  const { txt, lineColor, homeBg } = getColors('txt,lineColor,homeBg')
  return StyleSheet.create({
    tr: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      height: rpx(100),
      paddingLeft: rpx(36),
      paddingRight: rpx(36),
      borderBottomColor: lineColor,
      backgroundColor: homeBg,
      borderBottomWidth: rpx(1)
    },
    tit: {
      fontSize: rpx(32),
      marginRight: rpx(36),
      color: txt
    },
    right: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      height: rpx(100)
    }
  })
}
