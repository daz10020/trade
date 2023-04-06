import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import EmImage from 'emrn-common/components/EmImage';
import React from 'react';
import { getColors } from '../../style';
import { getImgs } from '../../images';
import { jumpUrlFunc } from '../../utils/navigation'
import rpx from 'emrn-common/utils/rpx';

export const toMainTab = (idx, isLogin, isReplace) => {
  jumpUrlFunc({
    linkType: 3,
    linkUrl: isLogin ? idx > 2 ? 'Banks' : 'Main' : 'Login',
    params: { idx },
    method: isReplace ? 'replace' : 'navigate'
  }, 'Home_icons')
}

export default props => {
  // 样式
  const { icons, icon, iconTxt, iconImg } = getCss()
  const imgs = getImgs()
  const { list = [], isLogin } = props
  return <View style={icons}>
    {
      list.map((item, idx) =>
        <TouchableWithoutFeedback key={idx} onPress={_ => toMainTab(idx, isLogin)}>
          <View style={icon}>
            <EmImage source={imgs[`icon${idx}`]} style={iconImg}/>
            <Text style={iconTxt}>{item}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  </View>
}

const getCss = _ => {
  // 颜色
  const { iconTxt } = getColors('Home')

  return StyleSheet.create({
    icons: {
      // width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    icon: {
      paddingTop: rpx(36),
      alignItems: 'center',
      flexGrow: 1
    },
    iconTxt: {
      fontSize: rpx(28),
      fontFamily: 'PingFangSC-Regular',
      color: iconTxt,
    },
    iconImg: {
      width: rpx(56),
      height: rpx(56),
      marginBottom: rpx(10)
    }
  })
}
