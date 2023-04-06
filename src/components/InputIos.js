import React, { PureComponent } from 'react';
import { TextInput } from 'react-native'

export default class InputIos extends PureComponent {
  constructor(props) {
    super(props)
    // // 输入框
    // this.inp = null
  }

  // 价格框
  // setRef = e => this.inp = e

  render() {
    // 声明
    const { props: { inpStyle, ...otherProps }, setRef } = this
    // 渲染
    return <TextInput
      // ref={setRef}
      {...otherProps}
      style={[styles, inpStyle]}
    />
  }
}

const styles = {
  flex: 1,
  height: '100%',
  position: 'relative',
  zIndex: 1,
  justifyContent: 'center',
}
