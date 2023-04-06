import React from 'react'
import DefaultTabBar from 'react-native-scrollable-tab-view/DefaultTabBar';
import rpx from 'emrn-common/utils/rpx'
import { getColors } from '../style';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Dimensions } from 'react-native'
import linkTracker from '../utils/LinkTracker'

const { width } = Dimensions.get('screen')

const handleClick = (page, onPressHandler, props) => _ => {
  // 点击
  onPressHandler(page)
  try {
    // 声明
    const { logEvents = [] } = props
    // 埋点
    logEvents[page] && linkTracker.add({ logEvent: logEvents[page] })
  } catch (e) {}
}

export default props => {

  const { tabs = [], textStyle, style, bottomStyle, tabColor } = props
  // 宽度
  const itemWidth = width / tabs.length / 2
  // 主题颜色
  const { themeColor, Main: { tabBarAct } } = getColors('Main,themeColor')
  const color = tabColor === 'white' ? tabBarAct : themeColor
  // 样式
  const { wrapStyle, lineStyle, itemStyle, dfTxtStyle } = getCss()
  // 渲染
  return <DefaultTabBar
    {...props}
    style={[wrapStyle, style]}
    activeTextColor={color}
    renderTab={(name, page, isTabActive, onPressHandler) => (
      <TouchableWithoutFeedback key={name} onPress={handleClick(page, onPressHandler, props)}>
        <View style={itemStyle}>
          <Text style={[dfTxtStyle, textStyle, isTabActive ? { color, opacity: 1 } : null ]}>
            {name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )}
    underlineStyle={[bottomStyle, lineStyle, {
      left: itemWidth - rpx(25),
      backgroundColor: color
    }]}
  />
}
const getCss = _ => {
  const { txt,lineColor } = getColors('txt,lineColor')
  return StyleSheet.create({
    lineStyle: {
      width: rpx(50),
      height: rpx(6),
      borderRadius: rpx(3),
    },
    dfTxtStyle: {
      fontSize: rpx(28),
      color: txt
    },
    wrapStyle: {
      borderWidth: rpx(1),
      borderColor: lineColor
    },
    itemStyle: {
      flex: 1, alignItems: 'center', justifyContent: 'center'
    }
  })
}
