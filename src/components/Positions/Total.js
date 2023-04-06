import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React, { Component } from 'react';
import rpx from 'emrn-common/utils/rpx';
import { getColors, getZdColor } from '../../style';
import EmImage from 'emrn-common/components/EmImage'
import { getSingleImg } from '../../images';
import { jumpUrlFunc } from '../../utils/navigation';
import { Margin } from '../../conf/htmlUrls'



export default class Total extends Component {

  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
  }

  onClickQmark = _ => {
    jumpUrlFunc({ linkType: 1, linkUrl: Margin }, 'Pos.Qmark')
  }

  jumpToQh = _ => {
    jumpUrlFunc({
      linkType: 4,
      linkUrl: ' ',
      download: ''
    }, 'emtrade_maintrade_holding_option')
  }
  render() {
    // 声明
    const { styles, onClickQmark, jumpToQh, props } = this
    // 样式
    const { wrap, right, tip, txt, val, left, sumIcon, tr, totalTxt, safeIcon, label, col } = styles

    const { length = 0, PositionTotal = 0, _usePositionTotal = 0, plTotal = 0, CurrMargin = 0, hasOptions } = props

    return !length && !hasOptions ? <Text style={tip}>{`没有持仓记录`}</Text> : <View style={wrap}>
      <View style={left}>
        <EmImage source={getSingleImg('sum')} style={sumIcon}/>
        <View style={col}>
          <View style={tr}>
            <Text style={label}>总手:</Text>
            <Text style={val}>{PositionTotal}</Text>
          </View>
          <View style={tr}>
            <Text style={label}>可用:</Text>
            <Text style={val}>{_usePositionTotal}</Text>
          </View>
        </View>
        <View style={[col, right]}>
          <View style={tr}>
            <Text style={label}>盈亏总额:</Text>
            <Text style={[val, getZdColor(plTotal)]}>{Number(plTotal).toFixed(1)}</Text>
          </View>
          <View style={tr}>
            <View style={left}>
              <Text style={label}>总保证金</Text>
              <TouchableWithoutFeedback onPress={onClickQmark}>
                <EmImage source={getSingleImg('safe')} style={safeIcon}/>
              </TouchableWithoutFeedback>
              <Text style={label}>：</Text>
            </View>
            <Text style={val}>{Number(CurrMargin).toFixed(1)}</Text>
          </View>
        </View>
      </View>
      {
        hasOptions && <TouchableWithoutFeedback onPress={jumpToQh}>
          <View>
            <Text style={txt}>{'您当前有期权持仓，请至东方财富期货APP中查看 >>'}</Text>
          </View>
        </TouchableWithoutFeedback>
      }
      <View style={totalTxt}>
        <Text style={tip}>{`共有${length}条持仓记录`}</Text>
      </View>
    </View>
  }
}

const getCss = _ => {
  const { txt, deal: { tabBarBg, desc, label } } = getColors('txt,deal')
  return StyleSheet.create({
    wrap: {
      backgroundColor: tabBarBg,
      paddingTop: rpx(15)
    },
    tr: {
      flexBasis: '50%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: rpx(38)
    },
    col: {
      flex: 1
    },
    sumIcon: {
      width: rpx(50),
      height: rpx(50),
      marginRight: rpx(24),
      marginLeft: rpx(30)
    },
    right: {
      width: '54%',
      flex: 0,
      // flexShrink: 0,
      paddingRight: rpx(30),
      paddingLeft: rpx(30)
    },
    label: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(27),
      color: desc,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    val: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: rpx(28),
      color: txt,
    },
    txt: {
      textAlign: 'center',
      fontFamily: 'PingFangSC-Regular',
      color: '#3381E3',
      fontSize: rpx(24),
      marginTop: rpx(30)
    },
    tip: {
      textAlign: 'center',
      fontFamily: 'PingFangSC-Regular',
      color: label,
      fontSize: rpx(22),
      marginBottom: rpx(50),
      marginTop: rpx(20)
    },
    safeIcon: {
      width: rpx(28),
      height: rpx(28)
    },
    totalTxt: {
      marginBottom: rpx(-16)
    }
  })
}
