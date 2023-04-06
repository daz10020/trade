import React, { Component } from 'react';
import { Text, ScrollView, View, SafeAreaView, StyleSheet, RefreshControl } from 'react-native'
import { getColors, getZdColor } from '../style'
import rpx from 'emrn-common/utils/rpx'
import ButtonDIY from './ButtonDIY'
import { jumpUrlFunc } from '../utils/navigation'
import QuotesRequest from './Main/QuotesRequest';

const keys = [
  [
    { key: 'TradingDay', label: '交易日', fmt: val => val.replace(/^(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') },
    { key: 'staticEquity', label: '上日权益', Precision: 2 },
    { key: 'dqqy', label: '当前权益', Precision: 2 },
    { key: 'mValTotal', label: '持仓市值', Precision: 2 },
    { key: 'ggl', label: '杠杆率', Precision: 2 },
    { key: 'Available', label: '可用资金', Precision: 2, cls: 'noLine' }
  ],
  [
    { key: 'usePerc', label: '资金使用率' },
    { key: 'CloseProfit', label: '平仓盈亏', Precision: 2, zdKey: 'CloseProfit' },
    { key: 'CloseProfitPerc', label: '平仓盈亏(率)', zdKey: 'CloseProfit' },
    { key: 'dsfyTotal', label: '盯市盈亏', Precision: 2, zdKey: 'dsfyTotal' },
    { key: 'dsfyTotalPerc', label: '盯市盈亏(率)', zdKey: 'dsfyTotal', cls: 'noLine' },
  ],
  [
    { key: 'CurrMargin', label: '保证金', Precision: 2 },
    { key: 'FrozenMargin', label: '挂单保证金', Precision: 2 },
    { key: 'crj', label: '出入金', Precision: 2 },
    { key: 'WithdrawQuota', label: '可取资金', Precision: 2 }
  ]
]

// 撤单
const _handleClick = Funds => _ => {
  jumpUrlFunc({ linkType: 3, linkUrl: 'Banks', params: { Funds } }, 'AccDetail.toBank')
}

const AccDetails = props => {
  // 样式
  const { wrap, col, itemStyle, txt, leftTxt, noLine, noMargin, btnStyle, txtStyle, bottomStyle } = getCss()
  // 声明
  const { Funds = {}, getFunds } = props

  return <SafeAreaView style={wrap}>
    <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={getFunds}/>}>
      {
        keys.map((item, idx) =>
          <View key={idx} style={[col, idx === keys.length - 1 ? noMargin : null]}>
            {
              item.map(n => {
                // 声明
                const { key, label, cls, fmt, Precision, zdKey } = n || {}
                // 转换
                const val = typeof fmt === 'function' ? fmt(Funds[key] || '') : (Funds[key] || 0)
                // 渲染
                return (
                  <View key={key} style={[itemStyle, cls ? noLine : null]}>
                    <Text style={[txt, leftTxt]}>{label}</Text>
                    <Text style={[txt, zdKey ? getZdColor(Funds[zdKey] || 0) : null]}>{Precision ? Number(val).toFixed(Precision) : val}</Text>
                  </View>
                )
              })
            }
          </View>
        )
      }
    </ScrollView>
    <View style={bottomStyle}>
      <ButtonDIY title={'银期转账'} onClick={_handleClick(Funds)} btnStyle={btnStyle} txtStyle={[txt, txtStyle]}/>
    </View>
  </SafeAreaView>
}
const getCss = _ => {
  // 当前皮肤
  const { txt, homeBg, Bank: { bg, txt: bTxt }, accDetails: { lineColor, txt: accTxt }, themeColor } = getColors('txt,homeBg,Bank,accDetails,themeColor')

  return StyleSheet.create({
    wrap: {
      flex: 1
    },
    col: {
      width: '100%',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      backgroundColor: homeBg,
      marginBottom: rpx(20)
    },
    itemStyle: {
      height: rpx(90),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: rpx(1),
      borderBottomColor: lineColor,
    },
    noMargin: {
      marginBottom: rpx(0)
    },
    noLine: {
      borderBottomWidth: rpx(0)
    },
    txt: {
      color: txt,
      fontSize: rpx(30),
      fontFamily: 'PingFangSC-Regular'
    },
    leftTxt: {
      color: accTxt
    },
    bottomStyle: {
      width: '100%',
      backgroundColor: homeBg,
      flexGrow: 1,
      paddingLeft: rpx(25),
      paddingTop: rpx(40)
    },
    btnStyle: {
      width: rpx(700),
      height: rpx(70),
      backgroundColor: themeColor,
      borderRadius: rpx(8),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: rpx(32)
    },
    txtStyle: {
      color: '#FFF'
    }
  })
}

// export default QuotesRequest(AccDetails)
export default AccDetails
