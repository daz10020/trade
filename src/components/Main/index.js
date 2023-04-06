import React, { Component } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native'
import { getColors } from '../../style'
import TabBar from '../TabBar'
import FundsTab from './FundsTab'
import DealTab from './DealTab'
import TradeTab from './TradeTab'
// import QuotesRequest from './QuotesRequest'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import rpx from 'emrn-common/utils/rpx'
import { postOrder } from '../../socket1/apis';
import { ORDER_COMB_OFFSET_FLAG_CLOSE_TODAY } from '../../store/dict'
import Throttle from '../Throttle'
import { logError } from '../../utils/tools'

// 埋点
const logEvents = ['emtrade_maintrade_trade', 'emtrade_maintrade_asset', 'emtrade_maintrade_order']

class MainTab extends Component {
  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
    // state
    this.state = {}
    //
    this.contentProps = {keyboardShouldPersistTaps: 'handled'}
  }

  // 提交表单
  submitOrder = params => {
    // 声明
    const { offsetFlg, volume, curPosi } = params
    const { _holdNumber } = curPosi[0] || {}
    try {
      // 非平仓
      if (!offsetFlg || !curPosi.length || typeof _holdNumber !== 'number') {
        // 提交报单
        return postOrder(params)
      }
      // 平昨数量
      const zVol = volume - _holdNumber
      // 平今数量
      const jVol = _holdNumber > 0 ? zVol > 0 ? _holdNumber : volume : 0
      // // 平今
      jVol > 0 && postOrder({
        ...params,
        volume: jVol,
        offsetFlg: ORDER_COMB_OFFSET_FLAG_CLOSE_TODAY
      })
      // 平昨
      zVol > 0 && postOrder({ ...params, volume: zVol })
    } catch (e) {
      // console.log(e)
      // 日志
      logError('submitOrder', e)
    }
  }

  render() {
    // 声明
    const {
      styles, props, submitOrder, contentProps,
      props: { tab = 0, Entrustment, getEntrusts, Deal, getDeals, Positions, getPositions, Funds, getFunds },
    } = this
    // 样式
    const { tabBar, tabBarTxt, tabBarLine, wrapper } = styles
    // 渲染
    return <SafeAreaView style={wrapper}>
      <ScrollableTabView
        prerenderingSiblingsNumber={0}
        initialPage={Number(tab)}
        contentProps={contentProps}
        // onChangeTab={handleChangeTab}
        renderTabBar={_ => <TabBar style={tabBar} textStyle={tabBarTxt} bottomStyle={tabBarLine} logEvents={logEvents} tabColor='white'/>}
      >
        <DealTab tabLabel='交易下单' {...props} submitOrder={submitOrder}/>
        <FundsTab
          tabLabel='资金持仓'
          Funds={Funds}
          Positions={Positions}
          getPositions={getPositions}
          getFunds={getFunds}
          submitOrder={submitOrder}
        />
        <TradeTab tabLabel='委托成交' Entrustment={Entrustment} getEntrusts={getEntrusts} Deal={Deal} getDeals={getDeals}/>
      </ScrollableTabView>
    </SafeAreaView>
  }
}

const getCss = _ => {
  // 颜色
  const { tabBarTxt, tabBarBg } = getColors('Main')

  return StyleSheet.create({
    wrapper: { flex: 1},
    tabBar: {
      backgroundColor: tabBarBg,
      paddingBottom: rpx(40),
      marginBottom: rpx(-38),
      height: rpx(120),
      // borderColor: lineColor,
      // borderWidth: rpx(10)
    },
    tabBarTxt: {
      fontSize: rpx(32),
      color: tabBarTxt,
      opacity: 0.8,
      fontWeight: 'normal'
    },
    tabBarLine: {
      bottom: rpx(40)
    }
  })
}

// export default QuotesRequest(Throttle(MainTab))
export default Throttle(MainTab)
