import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native'
import { getColors } from '../../style'
import ButtonDIY from '../ButtonDIY'
import rpx from 'emrn-common/utils/rpx'

// 合约搜索
export default class PriceBtn extends PureComponent {

  constructor(props) {

    super(props)
    // 样式
    this.styles = getCss()
    // 按钮
    this.btns = [
      { label: '对手价', type: 1 },
      { label: '最新价', type: 2 },
      { label: '市价', type: 3 },
      { label: '排队价', type: 4 }
    ]
  }

  // 填充
  handleClick = ({ label, type }, onClick) => _ => onClick({
    type,
    val: label
  })

  render() {
    // 声明
    const { props: { onClick, show }, handleClick, btns, styles } = this
    // 样式
    const { btnWrap, btnStyle, btnTxt, hide } = styles
    // 渲染
    return <View style={show ? btnWrap : hide}>
      {
        btns.map(item => <ButtonDIY
          key={item.type}
          title={item.label}
          btnStyle={show ? btnStyle : hide}
          txtStyle={btnTxt}
          onClick={handleClick(item, onClick)}
        />)
      }
    </View>
  }
}

const getCss = _ => {
  const { themeColor, PriceInp: { btnBorder, modal, border, btnBg } } = getColors('themeColor,PriceInp')
  return StyleSheet.create({
    hide: {
      width: 0,
      height: 0,
      borderWidth: 0
    },
    btnWrap: {
      position: 'absolute',
      top: rpx(78),
      left: 0,
      width: '100%',
      height: rpx(90),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: modal,
      borderWidth: rpx(1),
      borderColor: border,
      zIndex: 3,
      borderRadius: rpx(4)
    },
    btnStyle: {
      flexGrow: 1,
      borderRadius: rpx(6),
      borderWidth: rpx(1),
      borderColor: btnBorder,
      height: rpx(50),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: rpx(8),
      marginLeft: rpx(8),
      backgroundColor: btnBg
    },
    btnTxt: {
      fontSize: rpx(26),
      color: themeColor
    }
  })
}
