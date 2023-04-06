import React from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Thead from './Thead'
import Line from './Line'
import rpx from 'emrn-common/utils/rpx'

// 单个高度
export const ITEM_HEIGHT = 105
// 高度
const ITEM_HEIGHT_num = rpx(ITEM_HEIGHT)
const getItemLayout = (data, index) => (
  {length: ITEM_HEIGHT_num, offset: ITEM_HEIGHT_num * index, index}
)
// 样式
const wrap = { flex: 1 }
const tip = {
    textAlign: 'center',
    marginTop: rpx(40),
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    fontSize: rpx(22)
}
export default props => {
  // 属性
  const { list, thead, onRefresh, wrapStyle, tipTxt, ...options } = props
  // 条数
  const { length } = list
  // 渲染
  return <View style={[wrap, wrapStyle]}>
    <FlatList
      style={wrap}
      data={list}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={<Thead column={thead}/>}
      keyboardShouldPersistTaps={'handled'}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={Line}
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh}/>}
      ListFooterComponent={<Text style={tip}>{`${length ? `共有${length}条` : '没有'}${tipTxt}记录`}</Text>}
      {...options}
    />
  </View>
}
