import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { getColors } from '../../style';
import rpx from 'emrn-common/utils/rpx';
import ActList from "./ActList";
import EmAlert from 'emrn-common/components/EmAlert'
import Total from "../Positions/Total";

const thead = ['合约/方向', '手数/可平', '现价/成本', '总盈亏/保证金']

// 撤单
const _closePositions = props => item => {
  // 声明
  const { InstrumentID, ClientInstrumentName, ExchangeID, _longFlg, mcj, mrj, _usePosition } = item
  // 可用为0
  if (!_usePosition) return EmAlert({ title: '温馨提示', message: '合约可用手数为0，请先撤单后尝试平仓。' })
  // 交易方向
  const direction = _longFlg ? 1 : 0
  // 价格
  const price = direction ? mrj : mcj
  // 提示
  EmAlert({
    title: `下单确认`,
    message: <View>
      <Text>合约名称：{ClientInstrumentName}</Text>
      <Text>交易方向：{direction ? '卖出' : '买入'}平仓</Text>
      <Text>委托价格：{price}</Text>
      <Text>委托数量：{_usePosition}</Text>
    </View>,
    buttons: ['取消', '确定'],
    onOk: _ => props.submitOrder({
      ExchangeID, code: InstrumentID, direction, price, offsetFlg: 1, volume: _usePosition, curPosi: [item]
    })
  })
}

export default props => {
  // 样式
  const { block, tr, td, r, normal, red, green, wColor, redBg, greenBg, left } = getCss()
  // 持仓列表
  const { list, onRefresh, Funds, onClickRow } = props
  const { length } = list
  // 渲染
  return <ActList
    list={list}
    thead={thead}
    onRefresh={onRefresh}
    onClickRow={onClickRow}
    btns={[{ title: '平仓', onClick: _closePositions(props) }]}
    Item={item => {
      const { Position, ClientInstrumentName, _longFlg, _useMargin, p, pl, _cost = 0, _usePosition, zsjd = 0 } = item
      return <View style={tr}>
        <Text style={[td, left, normal]}>{ClientInstrumentName}</Text>
        <Text style={td}>{Position}</Text>
        <Text style={td}>{p}</Text>
        <Text style={[td, r, pl > 0 ? red : green]}>{pl}</Text>
        <View style={block}>
          <Text style={[wColor, _longFlg ? redBg : greenBg]}>{_longFlg ? '多' : '空'}</Text>
        </View>
        {/*可平=持仓手数-空头/多头冻结*/}
        <Text style={td}>{_usePosition}</Text>
        {/*OpenAvgPrice 开仓均价=开仓成本OpenCost/手数Position/合约乘数*/}
        <Text style={td}>{Number(_cost).toFixed(zsjd)}</Text>
        <Text style={[td, r]}>{_useMargin}</Text>
      </View>
    }}
    listOptions={{ ListFooterComponent: <Total {...Funds} length={length}/> }}
  />
}

const getCss = _ => {
  // 颜色
  const { txt, z, d } = getColors('txt,z,d')

  return StyleSheet.create({
    tr: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    td: {
      color: txt,
      fontSize: rpx(28),
      lineHeight: rpx(56),
      width: '25%',
      textAlign: 'right',
      fontFamily: 'PingFangSC-Medium',
    },
    block: {
      width: '25%',
      paddingLeft: rpx(30)
    },
    normal: {
      fontFamily: 'PingFangSC-Regular',
      fontWeight: 'normal'
    },
    left: {
      textAlign: 'left',
      paddingLeft: rpx(30)
    },
    r: {
      paddingRight: rpx(30)
    },
    red: {
      color: z
    },
    green: {
      color: d
    },
    wColor: {
      width: rpx(40),
      height: rpx(40),
      lineHeight: rpx(40),
      textAlign: 'center',
      fontSize: rpx(22),
      color: '#fff',
      borderRadius: rpx(6),
      fontFamily: 'PingFangSC-Medium',
      fontWeight: 'bold'
    },
    redBg: {
      backgroundColor: z
    },
    greenBg: {
      backgroundColor: d
    },
    hide: {
      width: 0,
      height: 0
    },
  })
}
