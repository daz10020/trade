import React, { Component } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Keyboard, TouchableWithoutFeedback, } from 'react-native'
import EmImage from 'emrn-common/components/EmImage'
import InputDIY from '../InputDIY'
import AccountList from './AccountList'
import { getImgs } from '../../images'
import { getColors } from '../../style'
import rpx from 'emrn-common/utils/rpx'
import TelBox from '../TelBox'
import ButtonDIY from '../ButtonDIY'
import DownloadPopup from '../../components/DownloadPopup'
import { backupSoftwareDownload, futuresOpen, futuresOpenH5, riskReadUrl } from '../../conf/htmlUrls'
import { jumpUrlFunc } from '../../utils/navigation'
import { EmAlert } from 'emrn-common/components'
import { Compat, Toast } from 'emrn-common/utils/hybrid'
import { getGlobalData } from '../../conf/tools'
import linkTracker from '../../utils/LinkTracker'
import Popup from './Popup'
import { getSingleImg } from '../../images';
import { getCache, setCache, delCache } from '../../utils/cache'

// 本地缓存登录账号和登录次数数据的key值
export const USERMSG = 'user_storage_msg'
// 资金账号最大数
const MAXLENGTH = 15

class Login extends Component {

  constructor(props) {
    super(props)
    // 默认账号
    const { defAccount, list } = props
    // 文字
    const { loginDesc = '', passwordDesc } = getGlobalData('conf_futuresApp') || {}
    // 合并
    Object.assign(this, {
      // 文字
      loginDesc, passwordDesc,
      // 弹窗
      popup: null,
      // 应用环境
      appType: getGlobalData('AppInfo').appType,
      // 样式
      styles: getCss(),
      // 图片
      imgs: getImgs('Home'),
      // 隐私权限
      auth: true,
      // 状态
      state: {
        showMore: false,
        readRisk: false,
        isHandSelected: false, // 用户手动点击了同意/取消勾选，后续切换账号都不处理勾选逻辑了
        userId: defAccount || (list.length ? list[0].userId : ''),
        password: '',
      }
    })
  }

  // 登录
  handleLogin = async _ => {
    // 收起键盘
    Keyboard.dismiss()
    // 声明
    const { state: { userId, password, readRisk }, auth, popup, styles: { alert, riskTitle } } = this
    // 未授权
    if (!auth) return popup._toggle()
    // 账号
    if (!userId) return Toast.show({ gravity: 'center', text: '请输入期货账号！' })
    // 密码
    if (!password) return Toast.show({ gravity: 'center', text: '请输入期货密码！' })
    // 勾选电子风险揭示书
    if (readRisk) {
      // 登录
      this.props.login({ userId, password }, async () => {
        // 如果本次登录账号没有存在于缓存中，那就存进去，下次输入账号识别一下，自动勾选揭示书
        const userStorage = (await getCache(USERMSG)) || []
        if (userStorage) {
          if (!userStorage.includes(userId)) {
            userStorage.push(userId)
            setCache(USERMSG, JSON.stringify(userStorage))
          }
        }
      })


    } else {
      // 未勾选
      EmAlert({
        title: '电子交易风险揭示书',
        message: <Text style={[alert, { textAlign: 'left' }]}>
          为更好地保障您的个人权益，请充分阅读并理解
          <TouchableWithoutFeedback onPress={this.jumpToRiskCnt}>
            <Text style={[riskTitle, { fontSize: rpx(32) }]}> 电子交易风险揭示书</Text>
          </TouchableWithoutFeedback>
          ，然后点击同意继续
        </Text>,
        buttons: ['不同意', '同意'],
        onOk: _ => {
          this.setState({ readRisk: true }, () => {
            this.handleLogin()
          })
        }
      })
    }

  }

  // 输入框
  handleChangeUserId = val => {
    this.setState({
      userId: val
    }, async () => {
      // 对比缓存中登录过的账号
      const { userId } = this.state
      // ['xxx', 'yyy'] // 当前登录账号，在以前登录过，默认勾选风险揭示书
      this.setReadRisk(userId)
    })
  }
  handleChangePwd = val => this.setState({ password: val })

  // 折叠面板
  _toggleArrow = _ => {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  // 阅读电子风险揭示书
  _toggleRiskRead = _ => {
    const { readRisk } = this.state
    this.setState({
      readRisk: !readRisk,
      isHandSelected: true,
    })
  }

  // 进入电子风险揭示书
  jumpToRiskCnt = _ => jumpUrlFunc({ linkType: 1, linkUrl: riskReadUrl })

  // 选中账号
  _selectAccount = item => {
    // 选中的账号如果不存在于风险揭示书的账号缓存中(表示此账号是揭示书勾选功能上线前登录过的），则不勾选，即使用户之前勾选过
    this.setState({
      userId: item.userId,
      showMore: false
    })
    if (!this.state.isHandSelected) {
      this.setState({ readRisk: false }, () => {
        this.setReadRisk(item.userId)
      })
    }
  }
  // 左侧链接
  _leftLink = _ => jumpUrlFunc({
    linkType: 1,
    linkUrl: backupSoftwareDownload,
    logEvent: 'emtrade_logon_alttrade'
  }, 'emtrade_logon_alttrade')

  // 右侧链接
  _rightLink = _ => {
    // 埋点
    linkTracker.add({ logEvent: 'emtrade_logon_getaccount' })
    // 期货
    this.showJumpQH()
    // // 由于期货包会跳转至原生交易登录页面，暂时停用
    // this.appType === 'qhb' ? jumpUrlFunc({ linkType: 2, linkUrl: recoverAccount }, 'Login.recoverAccount')
    //   : this.showTel()
  }

  // 忘记密码
  _forgetPwd = _ => {
    // 埋点
    linkTracker.add({ logEvent: 'emtrade_logon_forgetpwd' })
    // 拨号
    this.showTel()
  }

  // 开户
  _accountOpen = _ => {
    // 埋点
    linkTracker.add({ logEvent: 'emtrade_logon_noaccount' })
    this.appType === 'qhb' ? jumpUrlFunc({ linkType: 2, linkUrl: futuresOpen }, 'Login.accountOpen')
      : jumpUrlFunc({ linkType: 1, linkUrl: futuresOpenH5 }, 'Login.accountOpen')
  }

  showTel = _ => EmAlert({
    title: `温馨提示`,
    message: '请联系客服处理：95357转7',
    buttons: ['取消', '呼叫'],
    onOk: _ => Compat.callTel({ tel: '95357' })
  })

  // 跳期货app弹窗
  showJumpQH = _ => DownloadPopup({
    trackEvent: 'Login.recoverAccount'
  })

  _onPwdFocus = _ => this.state.password && this.setState({ password: '' })

  setRef = e => this.popup = e

  setAuth = flg => {
    this.auth = flg
    flg && this.state.password && this.handleLogin()
  }

  setReadRisk = async (userId) => {
    // 通过选中的账号，并且是在风险揭示书功能上线前登录过
    const { readRisk, isHandSelected } = this.state
    let userStorage = await getCache(USERMSG).catch(() => {
      this.setState({ readRisk: false })
    })
    if (!isHandSelected) {
      if (userStorage && userId) {
        this.setState({ readRisk: userStorage.includes(userId) })
      } else {
        this.setState({ readRisk: false })
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { state: { userId }, props: { list } } = this

    if (prevProps.list && list && prevProps.list.length > list.length) {
      // 删除了某个下拉账号记录: prevList 取 list的补集
      let arr = prevProps.list.filter(item => {
        return !(list.some(li => item.userId === li.userId))
      })
      if (!arr.length || arr[0].userId === userId) {
        this.setState({
          userId: '',
          readRisk: false,
        })
      }
    }
  }

  componentDidMount() {
    this.setReadRisk(this.state.userId)
  }

  render() {
    const {
      _toggleArrow, _toggleRiskRead, jumpToRiskCnt, _selectAccount, _leftLink, _rightLink, _forgetPwd, _accountOpen,
      handleLogin, _onPwdFocus, handleChangeUserId, handleChangePwd, setRef, setAuth,
      imgs, styles, loginDesc, passwordDesc, state: { userId, password, showMore, readRisk, },
      props: { list, removeUserInfo }
    } = this
    // 图片
    const { user, pwd, logo: logoImg, arrow_b } = imgs
    // 样式
    const {
      wrapper, logo, row, icon, arrowBtn, riskBtn, arrow, arrowUp, pwdBtn, pwdBtnText,
      btn, btn1, btn2, btn1Txt, btn2Txt, desc, bottomBtns, bmBtnTxt, telBox, tips,
      riskBox, read, riskTitle, riskCircle,
    } = styles

    const radio = getSingleImg(readRisk ? 'radio_check' : 'radio')

    return <SafeAreaView style={wrapper}>
      <Popup ref={setRef} setAuth={setAuth}/>
      <View>
        <EmImage source={logoImg} style={logo}/>
        <View style={row}>
          <EmImage source={user} style={icon}/>
          <InputDIY
            isLogin={true}
            value={userId}
            keyboardType={'numeric'}
            clearButtonMode={'while-editing'}
            maxLength={MAXLENGTH}
            placeholder={'请输入期货资金账号'}
            onChangeText={handleChangeUserId}
          />
          <ButtonDIY btnStyle={arrowBtn} onClick={_toggleArrow}>
            <EmImage source={arrow_b} style={[arrow, showMore ? arrowUp : null]}/>
          </ButtonDIY>
        </View>
        <View style={row}>
          <EmImage source={pwd} style={icon} resizeMode="contain"/>
          <InputDIY
            isLogin={true}
            value={password}
            secureTextEntry
            // clearTextOnFocus
            clearButtonMode={'while-editing'}
            autoCorrect={false}
            placeholder={'请输入期货交易密码'}
            onChangeText={handleChangePwd}
            onFocus={_onPwdFocus}
          />
          <ButtonDIY onClick={_forgetPwd} title={'忘记密码'} txtStyle={pwdBtnText} btnStyle={pwdBtn}/>
        </View>
        {/* <Text style={tips}>{'交易密码至少8位，包含数字、字母或特殊字符'}</Text> */}
        <Text style={tips}>{passwordDesc}</Text>
        <View style={riskBox}>
          <ButtonDIY btnStyle={riskBox} onClick={_toggleRiskRead}>
            {Boolean(readRisk) && <EmImage source={getSingleImg('radio_check')} resizeMode="contain" style={riskBtn}/>}
            {!Boolean(readRisk) && <View style={riskCircle}></View>}
            <Text style={read}>已阅读并同意 </Text>
          </ButtonDIY>
          <ButtonDIY txtStyle={riskTitle} onClick={jumpToRiskCnt} title={'电子交易风险揭示书'}/>
        </View>
        <ButtonDIY onClick={handleLogin} title={'交易登录'} txtStyle={btn1Txt} btnStyle={[btn, btn1]}/>
        <ButtonDIY onClick={_accountOpen} title={'没有账号？点此开户'} txtStyle={btn2Txt} btnStyle={[btn, btn2]}/>
        {Boolean(loginDesc) ? <Text style={tips}>{loginDesc}</Text> : null}
        <View style={bottomBtns}>
          <ButtonDIY onClick={_leftLink} title={'备用交易方式'} txtStyle={bmBtnTxt}/>
          <ButtonDIY onClick={_rightLink} title={'找回资金账号'} txtStyle={bmBtnTxt}/>
        </View>
        <AccountList
          list={list}
          removeUserInfo={removeUserInfo}
          showMore={showMore}
          _ClickItem={_selectAccount}
          _toggleList={_toggleArrow}
        />
      </View>
      <TelBox style={telBox} trackCode={'emtrade_logon_hotline'}/>
    </SafeAreaView>
  }
}

const getCss = _ => {
  // 颜色
  const { lineColor, themeColor, Login: { tipsColor, circle } } = getColors('lineColor,themeColor,Login')
  const primary = '#3381E3'
  return StyleSheet.create({
    alert: {
      textAlign: 'center',
      fontSize: rpx(32),
      color: '#333'
    },
    wrapper: {
      flex: 1,
      justifyContent: 'space-between'
    },
    logo: {
      width: rpx(277),
      height: rpx(60),
      marginTop: rpx(50),
      marginBottom: rpx(50),
      alignSelf: 'center'
    },
    row: {
      width: '100%',
      height: rpx(90),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      borderBottomColor: lineColor,
      borderBottomWidth: rpx(1),
      position: 'relative',
    },
    icon: {
      width: rpx(38),
      height: rpx(38),
      marginRight: rpx(14)
    },
    ar111rowBtn: {
      padding: rpx(30),
      paddingLeft: rpx(24),
      paddingRight: rpx(6),
    },
    arrowBtn: {
      width: rpx(50),
      height: rpx(40),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: rpx(20)
    },
    arrow: {
      width: rpx(14),
      height: rpx(24),
      transform: [{ rotate: '90deg' }]
    },
    arrowUp: {
      transform: [{ rotate: '-90deg' }]
    },
    pwdBtn: {
      height: rpx(55),
      paddingLeft: rpx(55),
      marginLeft: rpx(12),
      borderLeftColor: lineColor,
      borderLeftWidth: rpx(1),
      justifyContent: 'center'
    },
    pwdBtnText: {
      fontSize: rpx(28),
      textAlignVertical: 'center',
      color: primary,
      fontFamily: 'PingFangSC-Regular',
    },
    btn: {
      height: rpx(80),
      backgroundColor: 'transparent',
      borderRadius: rpx(8),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: rpx(30),
      marginRight: rpx(30)
    },
    btn1: {
      backgroundColor: themeColor,
      marginTop: rpx(30)
    },
    btn1Txt: {
      color: '#fff',
      fontSize: rpx(32),
      fontFamily: 'PingFangSC-Regular'
    },
    btn2: {
      marginTop: rpx(30),
      borderColor: themeColor,
      borderWidth: rpx(1)
    },
    btn2Txt: {
      fontSize: rpx(32),
      color: themeColor,
      fontFamily: 'PingFangSC-Regular'
    },
    desc: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(24),
      color: '#999',
      textAlign: 'center',
      marginTop: rpx(16)
    },
    bottomBtns: {
      marginTop: rpx(24),
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    bmBtnTxt: {
      fontSize: rpx(28),
      color: primary,
      fontFamily: 'PingFangSC-Regular'
    },
    telBox: {
      marginBottom: rpx(40)
    },
    tips: {
      color: tipsColor,
      fontSize: rpx(24),
      marginLeft: rpx(30),
      marginRight: rpx(30),
      marginTop: rpx(16)
    },
    riskBox: {
      marginTop: rpx(12),
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    read: {
      color: tipsColor,
      fontSize: rpx(24),
    },
    riskBtn: {
      marginTop: rpx(4),
      marginLeft: rpx(30),
      marginRight: rpx(15),
      width: rpx(26),
      height: rpx(26),
    },
    riskCircle: {
      borderWidth: rpx(2),
      borderRadius: rpx(13),
      borderColor: circle,
      marginTop: rpx(4),
      marginLeft: rpx(30),
      marginRight: rpx(15),
      width: rpx(26),
      height: rpx(26),
    },
    riskTitle: {
      marginTop: rpx(12),
      fontSize: rpx(24),
      color: '#3381E3',
    },
  })
}
export default Login
