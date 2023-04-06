import React, { PureComponent } from 'react'
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native'
import Modal from './Modal'
import rpx from 'emrn-common/utils/rpx'
import { getCache, setCache, delCache } from '../../utils/cache'
import { getSingleImg } from '../../images'
import { getColors } from '../../style'
import { jumpUrlFunc } from '../../utils/navigation'
import { initDeviceInfo } from '../../conf/apis'
import { privacyAgreement } from '../../conf/htmlUrls'
import { USERS_AUTH_KEY } from '../../conf/constant'

export default class Popup extends PureComponent {

  constructor(props) {
    super(props)

    Object.assign(this, {
      checkImg: getSingleImg('radio_check'),
      radioImg: getSingleImg('radio'),
      clsImg: getSingleImg('popup_cls'),
      state: {
        visibility: false
      }
    })

  }

  componentDidMount() {
    // delCache('auth')
    // 缓存
    getCache(USERS_AUTH_KEY).then(async res => {
      // 没缓存则显示
      if (res) {
        await initDeviceInfo()
        return
      }
      this.setState({ visibility: true })
      this.props.setAuth(false)
    })
  }

  _toggle = _ => {
    this.setState({ visibility: !this.state.visibility })
  }


  _ok = _ => {

    setCache('auth', 1).then(async res => {
      this.setState({ visibility: false })
      await initDeviceInfo()
      this.props.setAuth(true)
    })
  }

  _link = _ => {
    jumpUrlFunc({ linkType: 1, linkUrl: privacyAgreement }, 'privacyAgreement')
  }

  render() {
    // 样式
    const { contain, tit, txt, actTxt } = getCss()
    // 属性
    const { state: { visibility }, _link, _ok, _toggle } = this
    // 渲染
    return <Modal visibility={visibility} options={{
      title: '期货交易隐私政策确认',
      titleStyle: tit,
      containerStyle: contain,
      buttons: ['不同意', '同意'],
      onOk: _ok,
      onCancel: _toggle,
      message: <View>
        <Text style={txt}>使用期货交易功能需先阅读并同意《东方财富期货隐私保护指引》。</Text>
        <Text style={txt}>我们深知个人信息对您的重要性，并将竭尽全力保障用户的隐私信息安全。</Text>
        <Text style={txt}>点击下方链接进一步了解详情：</Text>
        <TouchableWithoutFeedback onPress={_link}>
          <View><Text style={[txt, actTxt]}>《东方财富期货隐私保护指引》</Text></View>
        </TouchableWithoutFeedback>
      </View>
    }}/>
  }
}

const getCss = _ => {
  // 颜色
  const { txt, themeColor, dis } = getColors('txt,themeColor,dis')

  return StyleSheet.create({
    contain: {
      marginRight: rpx(61),
      marginLeft: rpx(61),
      padding: rpx(20),
      paddingBottom: 0
    },
    clsStyle: {
      width: rpx(40),
      height: rpx(40),
      position: 'absolute',
      right: rpx(-15),
      top: rpx(-100),
    },
    tit: {
      fontFamily: 'PingFangSC-Medium',
      fontSize: rpx(32),
      marginTop: rpx(-16),
      color: txt,
    },
    txt: {
      fontFamily: 'PingFangSC-Regular',
      color: txt,
      fontSize: rpx(30)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: rpx(30)
    },
    radioStyle: {
      width: rpx(30),
      height: rpx(30),
      marginRight: rpx(10),
    },
    desc: {
      fontFamily: 'PingFangSC-Regular',
      color: '#999',
      fontSize: rpx(28)
    },
    actTxt: {
      color: '#3381E3',
    },
    btn: {
      height: rpx(80),
      marginTop: rpx(30),
      marginBottom: rpx(-16),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: rpx(10),
      backgroundColor: themeColor
    },
    disable: {
      backgroundColor: dis
    },
    btnTxt: {
      fontFamily: 'PingFangSC-Regular',
      color: '#fff',
      fontSize: rpx(33)
    }
  })
}

