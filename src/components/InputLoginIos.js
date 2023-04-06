import React, { PureComponent } from 'react';
import { View, Platform, TouchableWithoutFeedback, StyleSheet, TextInput, Text } from 'react-native'
import EmImage from 'emrn-common/components/EmImage'
import rpx from 'emrn-common/utils/rpx'
import { getSingleImg } from '../images/index'

export default class InputAndroid extends PureComponent {
  constructor(props) {
    super(props)
    // 图片
    this.iconImg = getSingleImg('cls')
    // // 输入框
    // this.inp = null
  }

  // 价格框
  // setRef = e => this.inp = e

  // 清理
  handleClickClear = _ => {
    const { onChangeText } = this.props
    typeof onChangeText === 'function' && onChangeText('')
  }

  render() {
    // 声明
    const { iconImg, props, handleClickClear, setRef } = this
    // 重写props的clearButtonMode
    const inpProps = { ...props, clearButtonMode: 'never' }
    // 配置
    const { value, inpStyle, androidWrapStyle } = inpProps
    // 样式
    const { iconWrap, inp, icon, hide, padding, box } = styles
    // 渲染
    return <View style={[box, value ? padding : null, androidWrapStyle]}>
      <TextInput
        // ref={setRef}
        {...inpProps}
        style={[inp, inpStyle]}
      />
      <TouchableWithoutFeedback onPress={handleClickClear}>
        <View style={iconWrap}>
          <EmImage source={iconImg} resizeMode={'contain'} style={[icon, value ? null : hide]}/>
        </View>
      </TouchableWithoutFeedback>
    </View>
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    zIndex: 1,
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  padding: {
    paddingRight: rpx(50)
  },
  hide: {
    width: 0,
    height: 0
  },
  iconWrap: {
    position: 'absolute',
    right: rpx(6),
    top: 0,
    height: '100%',
    width: rpx(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: rpx(30),
    height: rpx(30),
  },
  inp: {
    padding: 0
  }
})
