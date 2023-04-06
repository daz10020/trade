import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EmAlert } from "emrn-common/components";
import rpx from 'emrn-common/utils/rpx';
import { getColors } from '../../style';
import Panel from '../Deal/Panel'
import TabBar from '../TabBar';
import PositionsList from '../Positions';
import EntrustList from '../List/EntrustList';
import DealList from '../List/DealList';
import CanRevokeList from '../List/CanRevokeList';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import EntrustTip from '../EntrustTip'

// 埋点
const logEvents = ['emtrade_maintrade_holding', 'emtrade_maintrade_pendingorder', 'emtrade_maintrade_order', 'emtrade_maintrade_deal']
// 交易
export default class DealTab extends PureComponent {
  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
    // 持仓列表
    this._posi = null
    // 报单面板
    this._panel = null
    // 面板
    this._tabs = null
  }

  handleClearPosAct = _ => {
    this._posi && this._posi._clearAct()
  }

  // 选中持仓
  handleClickPosiRow = item => {
    // 数据
    const { InstrumentID, _usePosition, _uid, _posiDirection } = item
    // 填充
    this._panel.setOrder({
      code: InstrumentID,
      uid: _uid,
      volume: `${_usePosition}`,
      curPosi: this.props.Positions.filter(i => i.InstrumentID === InstrumentID),
      actPosDirect: _posiDirection,
      price: { val: '对手价', type: 1 },
      baseInfo: item,
      quotes: item,
      marginRatio: undefined
    })
  }

  handleSubmit = (params, state) => {
    // 声明
    const { direction, price, offsetFlg, txt } = params
    // 声明
    const { baseInfo: { ClientInstrumentName, ExchangeID } = {}, curPosi, code, volume } = state
    // 提示
    EmAlert({
      title: `${txt === '锁仓' ? '锁仓' : '下单'}确认`,
      message: <View>
        <Text>合约名称：{ClientInstrumentName}</Text>
        <Text>交易方向：{direction ? '卖出' : '买入'}{offsetFlg ? '平仓' : '开仓'}</Text>
        <Text>委托价格：{price}</Text>
        <Text>委托数量：{volume}</Text>
      </View>,
      buttons: ['取消', '确定'],
      onOk: _ => {
        // 声明
        const { props: { submitOrder }, _panel, _posi } = this
        // 提交
        submitOrder({
          ExchangeID, code, direction, price, offsetFlg, volume, curPosi
        })
        // 重置
        // _panel && _panel.clearOrder()
        // 清空
        // _posi && _posi._clearAct()
      }
    })
  }

  // 跳转至成交列表
  handleToDealList = _ => this._tabs.goToPage(3)

  setPosi = e => this._posi = e
  setPanel = e => this._panel = e
  setScrollTab = e => this._tabs = e

  render() {
    const {
      styles, handleClickPosiRow, setPosi, setPanel, setScrollTab, handleSubmit, handleToDealList, handleClearPosAct,
      props: {
        Funds, Funds: { dqqy = 0, Available = 0, usePerc = 0 },
        Positions, Deal, Entrustment,
        getPositions, getEntrusts, getDeals, submitOrder
      }
    } = this
    // 样式
    const { wrap, tabBar, tabBarTxt, row, txt } = styles

    return <View style={wrap}>
      <View style={row}>
        <Text style={txt}>权益:{dqqy.toFixed(2)}</Text>
        <Text style={txt}>可用:{Available.toFixed(2)}</Text>
        <Text style={txt}>使用率:{usePerc}</Text>
      </View>
      <Panel
        ref={setPanel}
        Positions={Positions}
        handleSubmit={handleSubmit}
        handleClearPosAct={handleClearPosAct}
      />
      <ScrollableTabView
        ref={setScrollTab}
        style={wrap}
        prerenderingSiblingsNumber={0}
        renderTabBar={_ => <TabBar style={tabBar} textStyle={tabBarTxt} logEvents={logEvents}/>}
      >
        <PositionsList
          ref={setPosi}
          tabLabel='持仓'
          Funds={Funds}
          Positions={Positions}
          getPositions={getPositions}
          submitOrder={submitOrder}
          onClickRow={handleClickPosiRow}
        />
        <CanRevokeList tabLabel='挂单' list={Entrustment} onRefresh={getEntrusts}/>
        <View tabLabel='委托' style={wrap}>
          <EntrustTip list={Entrustment} onClick={handleToDealList}/>
          <EntrustList list={Entrustment} onRefresh={getEntrusts}/>
        </View>
        <DealList tabLabel='成交' list={Deal} onRefresh={getDeals}/>
      </ScrollableTabView>
    </View>
  }
}

const getCss = _ => {
  // 颜色
  const { homeBg, deal: { tabBarBg }, txt } = getColors('homeBg,txt,deal')

  return StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: homeBg,
        borderTopLeftRadius: rpx(12),
        borderTopRightRadius: rpx(12)
    },
    tabBar: {
      backgroundColor: tabBarBg,
      height: rpx(70),
    },
    tabBarTxt: {
      color: txt,
      fontSize: rpx(32)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      height: rpx(60)
    },
    txt: {
      color: '#999',
      fontSize: rpx(22),
      fontFamily: 'PingFangSC-Regular'
    },
    panelWrap: {
      padding: rpx(10),
      paddingTop: 0
    }
  })
}
