import React from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, FlatList } from 'react-native';
import EmImage from 'emrn-common/components/EmImage'
import ButtonDIY from '../ButtonDIY'
import rpx from 'emrn-common/utils/rpx'
import { getSingleImg } from '../../images';
import { getColors } from '../../style'
import Line from '../Line';
import { confuseAcc } from "../../utils/tools";

export default props => {
  // 样式
  const { wrap, row, icon_g, txt, btn, btnTxt } = getCss()
  // 声明
  const { handleClickItem, removeUserInfo, list } = props
  // 渲染
  return <FlatList
    style={wrap}
    data={list}
    ItemSeparatorComponent={Line}
    keyExtractor={item => item.userId}
    renderItem={({ item }) => {
      const { name = '', userId = '' } = item
      return <TouchableWithoutFeedback onPress={_ => handleClickItem(item)}>
        <View style={row}>
          <Text style={txt}>{`${name.replace(/./, '*')}\n${confuseAcc(userId)}`}</Text>
          {
            item.online
              ? <EmImage source={getSingleImg('g')} style={icon_g}/>
              : <ButtonDIY
                title={'删除'}
                btnStyle={btn}
                txtStyle={btnTxt}
                onClick={removeUserInfo(item)}
              />
          }
        </View>
      </TouchableWithoutFeedback>
    }

    }
  />

}

const getCss = _ => {
  const { userBar: { bg }, txt } = getColors('userBar,txt,lineColor')
  return StyleSheet.create({
    wrap: {
      maxHeight: rpx(370),
      backgroundColor: bg
    },
    row: {
      height: rpx(120),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
    },
    left: {
      width: '70%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    txt: {
      color: txt,
      fontSize: rpx(28),
      lineHeight: rpx(44)
    },
    icon_g: {
      width: rpx(49),
      height: rpx(32)
    },
    btn: {
      height: rpx(120),
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnTxt: {
      lineHeight: rpx(120),
      fontSize: rpx(28),
      color: '#999'
    }
  })
}
