import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from '../TabBar'
import TabForm from './TabForm'
import rpx from 'emrn-common/utils/rpx'
import { postB2F, postF2B } from '../../socket1/apis'

// 配置
const tab1Inps = ['bankList', 'bankPsw', 'fundsPsw', 'bankBalance', 'transVal']
const tab2Inps = ['WithdrawQuota', 'bankList', 'transVal', 'bankPsw', 'fundsPsw']

class BankTab extends PureComponent {
  constructor(props) {
    super(props)
    // state
    this.state = {
      conf: {},
      // 用户信息
      userId: '',
      // 通信对象
      socket: null
    }
  }

  render() {
    const { props: { bankList, Funds, getFunds } } = this
    const { wrap, tabBar, tabBarTxt } = styles

    return <ScrollableTabView
      prerenderingSiblingsNumber={0}
      // style={wrap}
      renderTabBar={_ => <TabBar style={tabBar} textStyle={tabBarTxt}/>}
    >
      <View tabLabel='银行转期货' style={wrap}>
        <TabForm bankList={bankList} inps={tab1Inps} onSubmit={postB2F} getFunds={getFunds}
                 btnBtmTxt="入金时间：交易日8:30-15:30，20:30-次日02:30" btnTxt={'转入'}
        />
      </View>
      <View tabLabel='期货转银行' style={wrap}>
        <TabForm Funds={Funds} bankList={bankList} inps={tab2Inps} onSubmit={postF2B} getFunds={getFunds}
                 btnBtmTxt="出金时间：交易日9:00-15:30" btnTxt={'转出'}
        />
      </View>
    </ScrollableTabView>
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  tabBar: {
    borderBottomWidth: 0
  },
  tabBarTxt: {
    fontSize: rpx(32)
  }
})

export default BankTab
