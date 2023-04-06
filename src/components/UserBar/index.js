import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, Dimensions } from 'react-native';
import EmImage from 'emrn-common/components/EmImage'
import { EmAlert } from 'emrn-common/components'
import ButtonDIY from '../ButtonDIY'
import List from './List'
import rpx from 'emrn-common/utils/rpx'
import { getSingleImg } from '../../images'
import { getColors } from '../../style'
import { confuseAcc } from '../../utils/tools'
import { setLoginRoute } from '../../utils/navigation'
import { getUserInfo } from '../../store/reducers/user'

// 屏幕高度
const { height: screenHeight } = Dimensions.get('screen')

export default class UserBar extends Component {
  constructor(props) {
    super(props)
    const { userList = [] } = props || {}
    // 用户信息
    this.userInfo = getUserInfo(userList)
    // 样式
    this.styles = getCss()
    // 声明
    this.state = {
      showFlg: false
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.userInfo = getUserInfo(nextProps.userList)
  }

  // 登出
  _loginOut = _ => {
    EmAlert({
      title: '',
      message: '退出后不会删除任何历史数据，下次登录依然可以使用本账号',
      buttons: ['取消', '退出'],
      onOk: _ => {
        this._addItem()
      }
    })
  }

  _addItem = _ => {
    // 登出
    this.props.loginOut()
    // 登录页面
    setLoginRoute()
    // 隐藏
    this.setState({ showFlg: false })
  }

  _fastLogin = ({ userId }) => {
    // 收起下拉框
    this.setState({ showFlg: false })
    // 用户信息
    const { userId: _userId } = this.userInfo || {}
    // 当前账号
    if (userId === _userId) return
    // // 快捷登录
    // this.props.fastLogin(userId).then(_ => {
    //   // 返回首页
    //   this.props.navigation.popToTop()
    // })
    // 登出
    this.props.loginOut()
    // 登录页面
    setLoginRoute({ defAccount: userId })
  }

  // 显隐下拉列表
  _toggleList = _ => {
    this.setState({ showFlg: !this.state.showFlg })
  }

  render() {
    // 声明
    const { props: { userList, removeUserInfo }, state: { showFlg }, userInfo, _loginOut, _toggleList, _addItem, _fastLogin, styles } = this
    // 样式
    const { wrap, modal, row, arrowBtn, arrow, txt, hideBox, hide, btnBox, btn, btnTxt, btnLine, up } = styles
    // 用户信息
    const { name = '', userId = '' } = userInfo || {}
    // 渲染
    return !userInfo ? null : <View style={[wrap, showFlg ? { height: screenHeight } : null]}>
      <TouchableWithoutFeedback onPress={_toggleList}>
        <View style={row}>
          <Text style={txt}>{`${name.replace(/./, '*')} ${confuseAcc(userId)}`}</Text>
          <View style={[arrowBtn, showFlg ? null : up]}>
            <EmImage source={getSingleImg('hrArrow')} style={arrow}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={[hideBox, showFlg ? null : hide]}>
        <List handleClickItem={_fastLogin} list={userList} removeUserInfo={removeUserInfo}/>
        <View style={[btnBox, showFlg ? null : hide]}>
          <ButtonDIY
            title={'退出'}
            btnStyle={btn}
            txtStyle={btnTxt}
            onClick={_loginOut}
          />
          <ButtonDIY
            title={'添加'}
            btnStyle={[btn, btnLine]}
            txtStyle={btnTxt}
            onClick={_addItem}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={_toggleList}>
        <View style={[modal, showFlg ? null : hide]}></View>
      </TouchableWithoutFeedback>
    </View>
  }
}

const getCss = _ => {
  const { userBar: { bg, borderColor }, txt, lineColor, themeColor } = getColors('userBar,txt,lineColor,themeColor')
  return StyleSheet.create({
    wrap: {
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 8
    },
    modal: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      opacity: 0.4,
      zIndex: 9
    },
    row: {
      height: rpx(80),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      borderBottomWidth: rpx(1),
      borderBottomColor: borderColor,
      backgroundColor: bg,
      zIndex: 10
    },
    txt: {
      color: txt,
      fontSize: rpx(30)
    },
    arrowBtn: {
      padding: rpx(20)
    },
    arrow: {
      width: rpx(24),
      height: rpx(14),
    },
    up: {
      transform: [{ rotate: '-180deg' }]
    },
    hideBox: {
      backgroundColor: bg,
      zIndex: 10
    },
    hide: {
      height: 0
    },
    btnBox: {
      height: rpx(100),
      flexDirection: 'row'
    },
    btn: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopColor: lineColor,
      borderTopWidth: rpx(1)
    },
    btnTxt: {
      fontSize: rpx(28),
      color: themeColor
    },
    btnLine: {
      borderLeftWidth: rpx(1),
      borderLeftColor: lineColor
    }
  })
}
