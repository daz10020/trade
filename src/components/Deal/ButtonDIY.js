import React, { Component } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { getColors } from '../../style'
import { rpx } from 'emrn-common/utils'

export default class ButtonDIY extends Component {
  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
    // 状态
    this.state = {
      act: false
    }
  }

  handlePressIn = _ => this.setState({ act: true })
  handlePressOut = _ => this.setState({ act: false })

  render() {
    // 声明
    const { props: { title, isFocus, style, onPress }, state: { act }, handlePressIn, handlePressOut, styles } = this
    // 样式
    const { btn, btnAct, btnTxt, btnTxtAct } = styles

    return <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={[btn, style, act || isFocus ? btnAct : null]}>
        <Text style={[btnTxt, act || isFocus ? btnTxtAct : null]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  }
}

const getCss = _ => {
  // 当前皮肤
  const { border, symbol, symbolBg, btnActBg, borderAct } = getColors('deal')
  const h = rpx(68)

  return StyleSheet.create({
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: h,
      height: h,
      borderWidth: rpx(1),
      borderColor: border,
      backgroundColor: symbolBg,
    },
    btnAct: {
      borderColor: borderAct,
      backgroundColor: btnActBg
    },
    btnTxt: {
      fontSize: rpx(40),
      color: symbol,
    },
    btnTxtAct: {
      color: borderAct,
    }
  })
}
