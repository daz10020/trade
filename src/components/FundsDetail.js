import EmImage from 'emrn-common/components/EmImage'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getColors, getZdColor } from '../style'
import rpx from 'emrn-common/utils/rpx'
import { getImgs, getSingleImg } from '../images'
import { jumpUrlFunc } from '../utils/navigation'
import { profit, WithdrawQuota } from '../conf/htmlUrls'
import ButtonDIY from './ButtonDIY'
import TextDIY from './TextDIY'

// 字段名
const keys = [
  { key: 'staticEquity', label: '上日权益', def: 0, Precision: 2 },
  { key: 'dqqy', label: '当前权益', def: 0, Precision: 2 },
  { key: 'CurrMargin', label: '保证金', def: 0, Precision: 2 },
  { key: 'crj', label: '出入金', def: 0, Precision: 2, fmt: ({ crj = 0 }) => ({ val: crj, style: getZdColor(crj) }) },
  { key: 'Available', label: '可用资金', def: 0, Precision: 2 },
  {
    key: 'WithdrawQuota', label: _ => {
      const { iconImg, tit, btnStyle } = getCss()
      const safe = getSingleImg('safe')
      return <ButtonDIY btnStyle={btnStyle} onClick={handleJumpKQ}>
        <Text style={tit}>可取资金</Text>
        <EmImage source={safe} style={iconImg}/>
      </ButtonDIY>
    }, def: 0, Precision: 2
  },
  {
    key: 'CloseProfit',
    label: '平仓盈亏(率)',
    def: '--',
    fmt: ({ CloseProfit = 0, CloseProfitPerc = '' }) => ({
      val: `${CloseProfit.toFixed(0)}(${CloseProfitPerc})`,
      style: getZdColor(CloseProfit)
    })
  },
  {
    key: 'dsfyTotal',
    label: '盯市盈亏(率)',
    def: '--',
    fmt: ({ dsfyTotal = 0, dsfyTotalPerc = '' }) => ({
      val: `${dsfyTotal}(${dsfyTotalPerc})`,
      style: getZdColor(dsfyTotal)
    })
  },
  { key: 'usePerc', label: '资金使用率', def: '--' }
]

// 银期转账
const handleJumpBank = Funds => _ => {
  jumpUrlFunc({ linkType: 3, linkUrl: 'Banks', params: { Funds } }, 'Funds.bank')
}

// 账户详情
const handleJumpDetail = Funds => _ => {
  jumpUrlFunc({ linkType: 3, linkUrl: 'AccDetails', params: { Funds } }, 'Funds.detail')
}

// 可取资金
const handleJumpKQ = _ => jumpUrlFunc({ linkType: 1, linkUrl: WithdrawQuota }, 'Funds.WithdrawQuota')

// 盈亏对不上
const handleJumpQues = _ => jumpUrlFunc({ linkType: 1, linkUrl: profit }, 'Funds.profit')

export default props => {
  // 样式
  const { wrap, itemStyle, row, btnStyle, btnTxt, tit, txt, img, iconImg, iconTxt } = getCss()

  const { Funds } = props
  // 资金
  const hasFunds = Object.keys(Funds).length
  // 图片
  const { transfer, funds, question } = getImgs('transfer,funds,question')
  // 渲染
  return <View>
    <View style={wrap}>
      {
        keys.map(item => {
          const { key, label, def, fmt, Precision } = item
          // 值
          let value = Funds[key] || def
          let txtStyle = null
          if (hasFunds && typeof fmt === 'function') {
            const { val, style } = fmt(Funds)
            value = val
            txtStyle = style
          }
          return <View key={key} style={itemStyle}>
            {typeof label === 'function' ? label() : <Text style={tit}>{label}</Text>}
            <TextDIY style={[txt, txtStyle]} fz={30} upper={74}>
              {!hasFunds ? def : Precision ? value.toFixed(Precision) : value || def}
            </TextDIY>
          </View>
        })
      }
    </View>
    <View style={row}>
      <ButtonDIY btnStyle={btnStyle} onClick={handleJumpBank(Funds)}>
        <EmImage source={transfer} style={img}/>
        <Text style={btnTxt}>银期转账</Text>
      </ButtonDIY>
      <ButtonDIY btnStyle={btnStyle} onClick={handleJumpDetail(Funds)}>
        <EmImage source={funds} style={img}/>
        <Text style={btnTxt}>资金详情</Text>
      </ButtonDIY>
      <ButtonDIY btnStyle={btnStyle} onClick={handleJumpQues}>
        <EmImage source={question} style={iconImg}/>
        <Text style={[btnTxt, iconTxt]}>盈亏对不上?</Text>
      </ButtonDIY>
    </View>
  </View>
}

const getCss = _ => {
  // 颜色
  const { txt, themeColor, lineColor } = getColors('txt,themeColor,lineColor')

  return StyleSheet.create({
    wrap: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    itemStyle: {
      borderBottomColor: lineColor,
      borderBottomWidth: rpx(1),
      flexBasis: '33%',
      marginTop: rpx(20),
      paddingBottom: rpx(20),
      borderRightColor: lineColor,
      borderRightWidth: rpx(1),
      display: 'flex',
      alignItems: 'center'
    },
    tit: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(26),
      lineHeight: rpx(44),
      color: '#999'
    },
    txt: {
      fontFamily: 'PingFangSC-Semibold',
      fontSize: rpx(30),
      lineHeight: rpx(44),
      color: txt
    },
    row: {
      height: rpx(80),
      display: 'flex',
      flexDirection: 'row',
      borderBottomColor: lineColor,
      borderBottomWidth: rpx(1)
    },
    btnStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnTxt: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(24),
      color: txt,
      paddingLeft: rpx(10)
    },
    img: {
      width: rpx(42),
      height: rpx(42)
    },
    iconTxt: {
      color: themeColor
    },
    iconImg: {
      width: rpx(25),
      height: rpx(25)
    }
  })
}
