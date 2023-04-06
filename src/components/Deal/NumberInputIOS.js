import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, TextInput } from 'react-native'
import ButtonDIY from './ButtonDIY'
import { getColors } from '../../style'
import { rpx } from 'emrn-common/utils'
import { accAdd, accMul } from '../../utils/calculate';


// 合约搜索
export default class NumberInputIOS extends Component {

  constructor(props) {
    super(props)
    // 合并
    Object.assign(this, {
      // 样式
      styles: getCss(),
      // 颜色
      placeholder: getColors('placeholder'),
      // 输入框
      inp1: null,
      inp2: null,
      // 状态
      state: {
        // 焦点
        focus: false,
      },
    })
  }

  // 节点
  // setRef = id => e => this[id] = e

  // 转换
  transNumber = onChangeText => (n = '') => onChangeText(n
    .replace(/[^\d.]/g, '')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.'))

  // 焦点
  handleFocus = _ => this.setState({ focus: true })

  // 失焦
  handleBlur = _ => this.setState({ focus: false })

  // 加减法
  handleClickBtn = flg => _ => {
    // 失去焦点
    Keyboard.dismiss()
    // 声明
    const { state: { focus }, props: { onClickBtn, onChangeText, min = 0, smallestUnit = 1, value = '0' } } = this
    // 未获得焦点时
    // if (!focus) {
      // // 样式
      // this.setState({ focus: true })
      // // 获取焦点
      // this.inp.handleFocus()
    // }
    // 计算
    const n = accMul(smallestUnit, flg)
    // 加
    const nSum = accAdd(value, n)
    // 小于最小值 则返回
    if (nSum < min) return
    // 继续
    return onClickBtn ? onClickBtn(value, n) : onChangeText(`${nSum}`)
  }
  // 加
  handleAdd = this.handleClickBtn(1)
  // 减
  handleSub = this.handleClickBtn(-1)

  render() {
    // 配置
    const {
      props, props: { wrapStyle, focusWrapStyle, onChangeText, label, FocusExtend, value },
      state: { focus },
      styles, handleAdd, handleSub, handleBlur, handleFocus, placeholder, transNumber
    } = this
    // 插件显示
    const focusFlg = focus && !Boolean(String(value))
    // 样式
    const { wrap, numberBox, inpBoxAct, inp, placeholderStyle, btnLeft, btnRight } = styles
    // 渲染
    return <View style={[wrap, wrapStyle, focusFlg ? focusWrapStyle : '']}>
      <View style={numberBox}>
        <ButtonDIY title="－" onPress={handleSub} isFocus={focus} style={btnLeft}/>
          <TextInput
            keyboardType={'numeric'}
            placeholderTextColor={focus ? 'transparent' : placeholder}
            placeholderStyle={placeholderStyle}
            placeholder={`请输入${label}`}
            {...props}
            clearButtonMode={'while-editing'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={transNumber(onChangeText)}
            style={[inp, focus ? inpBoxAct : null]}
          />
        <ButtonDIY title="＋" onPress={handleAdd} isFocus={focus} style={btnRight}/>
      </View>
      {FocusExtend && <FocusExtend show={focusFlg}/>}
    </View>
  }
}

const getCss = _ => {
  // 当前皮肤
  const { deal: { border, borderAct, inpTxt } } = getColors('deal')
  const h = rpx(68)
  const radius = rpx(6)

  return StyleSheet.create({
    wrap: {
      borderRadius: rpx(6),
      position: 'relative'
    },
    numberBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: h
    },
    inpBoxAct: {
      borderColor: borderAct
    },
    inp: {
      height: h,
      borderTopWidth: rpx(1),
      borderBottomWidth: rpx(1),
      // 抵消莫名阴影
      borderColor: border,
      position: 'relative',
      flex: 1,
      padding: 0,
      fontSize: rpx(26),
      color: inpTxt,
      textAlign: 'center'
    },
    btnLeft: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      borderTopRightRadius: 1,
    },
    btnRight: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
    },
    txtBox: {
      height: h,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      paddingLeft: rpx(5),
      paddingRight: rpx(5)
    },
    placeholderStyle: {
      fontSize: rpx(20)
    }
  })
}
