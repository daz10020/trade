import React, { PureComponent } from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { getColors, getZdColor } from '../../style';
import rpx from 'emrn-common/utils/rpx';
import ButtonDIY from '../ButtonDIY'
import TextDIY from '../TextDIY'
import { toQuotesFunc } from '../../utils/navigation'

export default class PosiItem extends PureComponent {
  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
  }

  toQuotes = toQuotesFunc(this.props, 'position.item')

  closePositions = _ => this.props._closePositions(this.props)

  clickRow = _ => {
    const { props: {id, _clickRow} ,props} = this
    _clickRow(id, props)
  }

  render() {
    // 声明
    const { props, styles, toQuotes, closePositions, clickRow } = this
    // 属性
    const {
      active, Position, ClientInstrumentName, _longFlg, _useMarginNum, price = '--', pl = '--', _cost = 0, _usePosition, Precision = 0
    } = props
    // 样式
    const {
      act, tr, tdTxt, r, nameStyle, wColor, redBg, greenBg, btnStyle, btnTxtStyle, btnRow, row, col, firstCol
    } = styles
    // 价格
    const priceNum = Number(price)
    // 成本价
    const costNum = Number(_cost).toFixed(Precision)
    const costNum1 = Number(_cost).toFixed(Precision + 1)
    // 渲染
    return <TouchableWithoutFeedback onPress={clickRow}>
      <View style={[tr, active ? act : null]}>
        <View style={row}>
          <View style={firstCol}>
            <View style={row}>
              <TextDIY style={[tdTxt, nameStyle]} fz={28} upper={60}>{ClientInstrumentName}</TextDIY>
              <Text style={tdTxt}>{Position}</Text>
            </View>
            <View style={row}>
              <Text style={[wColor, _longFlg ? redBg : greenBg]}>{_longFlg ? '多' : '空'}</Text>
              <Text style={tdTxt}>{_usePosition}</Text>
            </View>
          </View>
          <View style={col}>
            <Text style={tdTxt}>{isNaN(priceNum) ? price : priceNum.toFixed(Precision)}</Text>
            <Text style={tdTxt}>{Precision < 4 && costNum1 - costNum ? costNum1 : costNum}</Text>
          </View>
          <View style={[col, r]}>
            <TextDIY style={[tdTxt, getZdColor(pl)]} minFz={16} upper={58}>{pl}</TextDIY>
            <TextDIY style={[tdTxt]} minFz={16} upper={58}>{_useMarginNum}</TextDIY>
          </View>
        </View>
        {active ? <View style={btnRow}>
          <ButtonDIY title={'平仓'} onClick={closePositions} btnStyle={btnStyle}
                     txtStyle={btnTxtStyle}/>
          <ButtonDIY title={'行情'} onClick={toQuotes} btnStyle={btnStyle}
                     txtStyle={btnTxtStyle}/>
        </View> : null}
      </View>
    </TouchableWithoutFeedback>
  }
}


const getCss = _ => {
  // 颜色
  const { txt, themeColor, z, d, deal: { lineBg, lineBtnBdr, lineBtnBg }, homeBg } = getColors('homeBg,deal,txt,themeColor,lineColor,z,d')

  return StyleSheet.create({
    tr: {
      backgroundColor: homeBg
    },
    act: {
      backgroundColor: lineBg,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    firstCol: {
      width: '46%',
      paddingLeft: rpx(30),
    },
    col: {
      minWidth: '20%',
      flex: 1,
      overflow: 'hidden',
      paddingRight: rpx(20),
      alignItems: 'flex-end'
    },
    tdTxt: {
      color: txt,
      fontSize: rpx(28),
      lineHeight: rpx(56),
      fontFamily: 'PingFangSC-Medium',
    },
    nameStyle: {
      textAlign: 'left',
      fontFamily: 'PingFangSC-Regular',
      fontWeight: 'normal'
    },
    r: {
      paddingRight: rpx(30),
      flexGrow: 1
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
    btnRow: {
      width: '100%',
      height: rpx(70),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    hide: {
      width: 0,
      height: 0
    },
    btnStyle: {
      borderRadius: rpx(8),
      height: rpx(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: rpx(1),
      borderColor: lineBtnBdr,
      backgroundColor: lineBtnBg,
      width: rpx(180),
      marginRight: rpx(30)
    },
    btnTxtStyle: {
      color: themeColor,
      fontSize: rpx(26)
    }
  })
}
