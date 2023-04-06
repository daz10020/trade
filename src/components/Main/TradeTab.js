import React, { PureComponent } from 'react'
import TabBar from '../TabBar'
import EntrustList from '../List/EntrustList'
import DealList from '../List/DealList'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { View, StyleSheet } from 'react-native'
import rpx from 'emrn-common/utils/rpx'
import EntrustTip from '../EntrustTip'
import { getColors } from '../../style'

export default class TradeTab extends PureComponent {

  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
    // 锁
    this.tabs = null
  }

  componentWillUnmount() {
  }

  // 切换tab
  handleClickArrow = _ => {
    this.tabs.goToPage(1)
  }

  setRef = e => this.tabs = e

  render() {

    const {
        styles, handleClickArrow, onChangeTab, setRef,
      props: { Entrustment, getEntrusts, Deal, getDeals }
    } = this

    const { wrap, tabBarStyle } = styles

    return <ScrollableTabView
      ref={setRef}
      style={wrap}
      onChangeTab={onChangeTab}
      renderTabBar={_ => <TabBar style={tabBarStyle}/>}
    >
      <View tabLabel='当日委托' style={wrap}>
        <EntrustTip list={Entrustment} onClick={handleClickArrow}/>
        <EntrustList list={Entrustment} onRefresh={getEntrusts}/>
      </View>
      <DealList tabLabel='当日成交' list={Deal} onRefresh={getDeals}/>
    </ScrollableTabView>
  }
}

const getCss = _ => {
    // 颜色
    const homeBg = getColors('homeBg')
    return StyleSheet.create({
        wrap: {
            flex: 1,
            backgroundColor: homeBg,
            borderTopLeftRadius: rpx(12),
            borderTopRightRadius: rpx(12)
        },
        tabBarStyle: { height: rpx(70) },
    })
}
