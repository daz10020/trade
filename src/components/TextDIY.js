import React, { PureComponent } from 'react';
import { Text } from 'react-native'
import rpx from 'emrn-common/utils/rpx'
import { calcFZ } from '../utils/tools'

export default class TextDIY extends PureComponent {
  constructor(props) {
    super(props)
    // 配置
    const { fz, upper, minFz } = props
    // 计算函数
    this.calcFz = upper ? calcFZ({ fz, upper, minFz }) : null
  }

  render() {
    // 声明
    const { calcFz, props: { upper, children, style, ...passThroughProps } } = this
    // 样式合并
    const styleDiy = upper ? [style, { fontSize: rpx(calcFz(children)) }] : style
    // 渲染
    return <Text {...passThroughProps} style={styleDiy}>{children}</Text>
  }
}
