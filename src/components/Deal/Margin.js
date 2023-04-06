import React from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { getColors } from '../../style'
import { calcFZ } from '../../utils/tools'
import rpx from 'emrn-common/utils/rpx'

// 字号计算
const fzFunc = calcFZ({ fz: 22, upper: 165, minFz: 16 })
// 合约搜索
export default props => {
  // 声明
  const { volume, marginRate, VolumeMultiple, price } = props
  // 是否有数据
  const isVaild = volume && VolumeMultiple && marginRate && price && price !== '-'
  // 值
  const val = Math.round(marginRate * VolumeMultiple * price * volume)
  // 字号
  const fz = fzFunc(`交易手预计需要保证金元${volume}${val}`)
  // 样式
  const { wrap, txt, num } = getCss(fz)
  // 渲染
  return isVaild ? <View style={wrap}>
    <Text style={txt}>交易</Text>
    <Text style={num}>{volume}</Text>
    <Text style={txt}>手预计需要保证金</Text>
    <Text style={num}>{val}</Text>
    <Text style={txt}>元</Text>
  </View> : <View style={wrap}><Text style={txt}>交易--手预计需要保证金--元</Text></View>
}

const getCss = fz => {
  const { txt, num } = getColors('Margin')
  return StyleSheet.create({
    wrap: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: rpx(12),
      height: rpx(30),
    },
    txt: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(fz),
      color: txt
    },
    num: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: rpx(fz),
      color: num
    }
  })
}
