import React from 'react'
import { View } from 'react-native'
import rpx from 'emrn-common/utils/rpx'
import { getColors } from '../style'

const line = { width: '100%', height: rpx(1)}
export default props => {
  return <View style={[line, { backgroundColor: getColors('lineColor')}]}/>
}
