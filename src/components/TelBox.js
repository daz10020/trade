import React from 'react'
import EmImage from 'emrn-common/components/EmImage'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import { getColors } from '../style'
import { getSingleImg } from '../images'
import rpx from 'emrn-common/utils/rpx'
import { Compat } from 'emrn-common/utils/hybrid'
import linkTracker from '../utils/LinkTracker'

// 拨打电话
const handleClick = trackCode => _ => {
  // 埋点
  trackCode && linkTracker.add({ logEvent: trackCode })
  // 拨号
  Compat.callTel({ tel: '95357' })
}

export default props => {
  // 声明
  const { style, trackCode } = props
  // 样式
  const { telBox, telIcon, telTxt } = getCss()
  // 图片
  const telImg = getSingleImg('tel')
  // 渲染
  return <View style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={handleClick(trackCode)}>
      <View style={[telBox, style]}>
        <EmImage source={telImg} style={telIcon}/>
        <Text style={telTxt}>客服电话：95357转7</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
}

const getCss = _ => {
  // 颜色
  const { Home: { telBg }, themeColor } = getColors('Home,themeColor')

  return StyleSheet.create({
    telBox: {
      height: rpx(70),
      marginTop: rpx(54),
      marginLeft: rpx(30),
      marginRight: rpx(30),
      borderRadius: rpx(8),
      backgroundColor: telBg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    telIcon: {
      width: rpx(40),
      height: rpx(38),
      marginRight: rpx(24)
    },
    telTxt: {
      fontSize: rpx(26),
      color: themeColor,
    }
  })
}
