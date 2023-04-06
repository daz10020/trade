import React from 'react';
import Routes from './routes'
import { StatusBar } from 'react-native'
import { Easing, Animated, EmNavigation } from 'em-react-native'
import rpx from 'emrn-common/utils/rpx'
import NavigationService from 'emrn-common/navigation/NavigationService'
import EmTitleLeft from 'emrn-common/components/EmTitleLeft'
import { getColors } from '../style'
import { getGlobalData, setGlobalData } from '../conf/tools'

// 动画
const transitionConfig = _ => ({
  transitionSpec: {
    duration: 350,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps
    const { index } = scene
    const width = layout.initWidth
    return {
      opacity: position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      }),
      transform: [{
        translateX: position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0]
        })
      }]
    }
  }
})

// 默认样式
const baseOpts = {
  // transparentCard: true,
  // cardShadowEnabled: false,
  headerTitleAllowFontScaling: true,
  headerTitleContainerStyle: { width: '100%', left: 0 },
}

// 视图
export default props => {
  // 属性
  const { page, theme, varConf } = props
  // 环境变量
  setGlobalData('Theme', theme)
  // 颜色
  const { headerBg, homeBg } = getColors('headerBg,homeBg')
  // 全局配置初始化
  const { Screen: { statusBarHeight }, Device: { isIPad, isRN62 } } = getGlobalData('Screen, Device')
  // 0.62.2
  if(isRN62) {
    // 通栏设置
    StatusBar.setTranslucent(false)
    StatusBar.setBackgroundColor(headerBg)
  }
  // 可变更新
  const { isLogin } = varConf
  // 视图
  const AppNavigator = EmNavigation.createEmNavigator(Routes, {
    initialRouteName: isLogin ? page || 'Main' : 'Login', //可以通过启动参数设置默认首页
    // initialRouteName: 'Main', //可以通过启动参数设置默认首页
    defaultNavigationOptions: {
      ...baseOpts,
      headerStyle: {
        backgroundColor: headerBg,
        height: statusBarHeight,
        borderBottomWidth: 0,
        // marginTop: isRN62 ? 10 : 0,
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: 0
      },
      headerLeft: <EmTitleLeft theme={theme}/>,
      headerLeftContainerStyle: {
        position: 'absolute',
        left: 0,
        top: isIPad ? -10 : 0
      },
      headerTitleStyle: {
        fontSize: rpx(32),
        fontFamily: 'PingFangSC-Medium',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginTop: isIPad ? -10 : 0
      }
    },
    cardStyle: {
      backgroundColor: homeBg
    },
    transitionConfig
  })

  return <AppNavigator
    {...props}
    ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef)
    }}
  />
}
