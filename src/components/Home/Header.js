import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import EmImage from 'emrn-common/components/EmImage';
import React from 'react';
import { getColors } from '../../style';
import { getSingleImg } from '../../images';
import { jumpUrlFunc } from '../../utils/navigation'
import rpx from 'emrn-common/utils/rpx';
import { futuresOpen, futuresOpenH5 } from '../../conf/htmlUrls'
import { getGlobalData } from "../../conf/tools";

// 登录
const handleJumpLogin = _ => {
  jumpUrlFunc({ linkType: 3, linkUrl: 'Login', params: { idx: -1 } }, 'Home.toLogin')
}

// 开户
const handleJumpKH = _ => {
  getGlobalData('AppInfo').appType === 'qhb' ? jumpUrlFunc({ linkType: 2, linkUrl: futuresOpen }, 'Login.accountOpen')
    : jumpUrlFunc({ linkType: 1, linkUrl: futuresOpenH5 }, 'Login.accountOpen')
}

export default props => {
  // 样式
  const { top, left, txt, loginBtn, btnTxt, khBtn, arrow } = getCss()

  return <View style={top}>
    <View style={left}>
      <Text style={txt}>东方财富期货</Text>
      <TouchableWithoutFeedback onPress={handleJumpLogin}>
        <View style={loginBtn}>
          <Text style={btnTxt}>登录</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
    <TouchableWithoutFeedback onPress={handleJumpKH}>
      <View style={khBtn}>
        <Text style={btnTxt}>开户</Text>
        <EmImage source={getSingleImg('arrow')} style={arrow}/>
      </View>
    </TouchableWithoutFeedback>
  </View>
}


const getCss = _ => {
  // 颜色
  const { txt, themeColor, lineColor } = getColors('Home,txt,themeColor,lineColor')

  return StyleSheet.create({

    top: {
      // width: '100%',
      height: rpx(80),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: lineColor,
      borderBottomWidth: rpx(1),
      paddingLeft: rpx(30)
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    txt: {
      fontSize: rpx(28),
      fontFamily: 'PingFangSC-Regular',
      color: txt,
      textAlignVertical: 'center'
    },
    loginBtn: {
      width: rpx(108),
      height: rpx(50),
      borderWidth: 1,
      borderColor: themeColor,
      borderRadius: rpx(8),
      marginLeft: rpx(24),
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnTxt: {
      fontSize: rpx(28),
      fontFamily: 'PingFangSC-Regular',
      color: themeColor,
      textAlign: 'center'
    },
    khBtn: {
      width: rpx(150),
      height: '100%',
      paddingRight: rpx(30),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    arrow: {
      width: rpx(14),
      height: rpx(24),
      marginLeft: rpx(14)
    }
  })
}
