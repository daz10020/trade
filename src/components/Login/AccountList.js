import React from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import EmImage from 'emrn-common/components/EmImage'
import rpx from 'emrn-common/utils/rpx'
import { getSingleImg } from '../../images';
import { getColors } from '../../style'
import Line from '../Line';
import ButtonDIY from '../ButtonDIY'

// 屏幕高度
const { height: screenHeight } = Dimensions.get('screen')

export default props => {
  // 样式
  const { wrap, userList, row, clsBtn, clsIcon, txt, itemRow, modal, hide } = getCss()
  // 属性
  const { _ClickItem, showMore, _toggleList, list, removeUserInfo } = props
  // 渲染
  return <View style={[wrap, showMore ? { height: screenHeight }: null]}>
    <FlatList
      data={list}
      keyExtractor={item => item.userId}
      style={[userList, showMore ? null : hide]}
      ItemSeparatorComponent={Line}
      renderItem={({ item }) =>
        <TouchableWithoutFeedback onPress={_ => _ClickItem(item)}>
          <View style={[row, itemRow]}>
            <Text style={txt}>{item.userId}</Text>
            <ButtonDIY onClick={removeUserInfo(item)} btnStyle={clsBtn}>
              <EmImage source={getSingleImg('cls')} style={clsIcon}/>
            </ButtonDIY>
          </View>
        </TouchableWithoutFeedback>
      }
    />
    <TouchableWithoutFeedback onPress={_toggleList}>
      <View style={[modal, showMore ? null : hide]}></View>
    </TouchableWithoutFeedback>
  </View>
}

const getCss = _ => {
  // 颜色
  const { lineColor, Login: { accountBg } } = getColors('Login,lineColor')

  return StyleSheet.create({
    wrap: {
      position: 'absolute',
      top: 0,
      width: '100%'
    },
    userList: {
      width: '100%',
      maxHeight: rpx(270),
      backgroundColor: accountBg,
      position: 'absolute',
      top: rpx(250),
      left: 0,
      zIndex: 10
    },
    row: {
      width: '100%',
      height: rpx(90),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      position: 'relative',
    },
    itemRow: {
      paddingLeft: rpx(100)
    },
    txt: {
      color: '#999',
      fontSize: rpx(26)
    },
    clsBtn: {
      padding: rpx(15)
    },
    clsIcon: {
      width: rpx(28),
      height: rpx(28),
    },
    hide: {
      height: 0
    },
    modal: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 9
    }
  })
}

