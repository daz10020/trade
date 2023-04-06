import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import EmImage from 'emrn-common/components/EmImage';
import { getColors } from '../style';
import rpx from 'emrn-common/utils/rpx';
import { getSingleImg } from '../images';

export default props => {
  // 样式
  const { tips, txt, icon} = getCss()
  // 图片
  const img = getSingleImg('arrow_circle')
  // 配置
  const { list, onClick } = props
  // 渲染
  return list.length ? <TouchableWithoutFeedback onPress={onClick}>
    <View style={tips}>
      <Text style={txt}>委托价并非最终成交价，实际成交价请在成交列表中查看</Text>
      <EmImage source={img} style={icon}/>
    </View>
  </TouchableWithoutFeedback> : null
}

const getCss = _ => {
  const { themeColor, tipsBg } = getColors('themeColor,tipsBg')
  return StyleSheet.create({
    tips: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: rpx(8),
      backgroundColor: tipsBg,
      paddingLeft: rpx(12),
      paddingRight: rpx(12),
      height: rpx(50),
      marginRight: rpx(30),
      marginLeft: rpx(30),
      marginTop: rpx(16)
    },
    txt: {
      color: themeColor,
      fontSize: rpx(24)
    },
    icon: {
      width: rpx(30),
      height: rpx(30)
    }
  })
}
