import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native'
import ButtonDIY from './ButtonDIY'
import InputDIY from '../InputDIY'
import { getColors } from '../../style'
import { rpx } from 'emrn-common/utils'
import { accAdd, accMul } from '../../utils/calculate';

// 合约搜索
export default class NumberInput extends Component {

  constructor(props) {
    super(props)
    // 合并
    Object.assign(this, {
      // 样式
      styles: getCss(),
      // 颜色
      placeholder: getColors('placeholder'),
      // 输入框
      inp: null,
      // 状态
      state: {
        // 焦点
        focus: false,
      },
    })
  }

  // 节点
  // setRef = e => this.inp = e
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
      styles, handleAdd, handleSub, handleBlur, handleFocus, placeholder, transNumber, setRef
    } = this
    // 插件显示
    const focusFlg = focus && !Boolean(String(value))
    // 样式
    const { wrap, numberBox, inpBox, inpBoxBorder, inpBoxAct, inp, unitWrapStyle, unitStyle, placeholderStyle, btnLeft, btnRight } = styles
    // 渲染
    return <View style={[wrap, wrapStyle, focusFlg ? focusWrapStyle : '']}>
      <View style={numberBox}>
        <ButtonDIY title="－" onPress={handleSub} isFocus={focus} style={btnLeft}/>
        <InputDIY
          keyboardType={'numeric'}
          placeholderTextColor={focus ? 'transparent' : placeholder}
          placeholderStyle={placeholderStyle}
          style={inp}
          placeholder={`请输入${label}`}
          {...props}
          // ref={setRef}
          wrapStyle={[inpBoxBorder, focus ? inpBoxAct : inpBox]}
          unitStyle={unitStyle}
          unitWrapStyle={unitWrapStyle}
          clearButtonMode={'while-editing'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={transNumber(onChangeText)}
        />
        <ButtonDIY title="＋" onPress={handleAdd} isFocus={focus} style={btnRight}/>
      </View>
      {FocusExtend && <FocusExtend show={focusFlg}/>}
    </View>
  }
}

const getCss = _ => {
  // 当前皮肤
  const { placeholder, deal: { border, borderAct, inpTxt } } = getColors('deal,placeholder')
  const h = rpx(68)
  const radius = rpx(6)

  return StyleSheet.create({
    wrap: {
      borderRadius: rpx(6),
      position: 'relative',
    },
    numberBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: h
    },
    inpBox: {
      paddingRight: 0,
    },
    inpBoxBorder: {
      borderTopWidth: rpx(1),
      borderBottomWidth: rpx(1),
      // 抵消莫名阴影
      borderColor: border,
    },
    inpBoxAct: {
      borderColor: borderAct
    },
    inp: {
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
    unitWrapStyle: {
      width: 'auto',
      right: rpx(44)
    },
    unitStyle: {
      color: placeholder,
      fontSize: rpx(26)
    },
    placeholderStyle: {
      fontSize: rpx(20)
    }
  })
}
