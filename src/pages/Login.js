import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from '../components/Login'
import { Toast } from 'emrn-common/utils/hybrid'
import { login, removeUserInfo, refreshLoginState } from '../store/actions/user'
import { getInfoByPage } from '../store/actions/pages'
import { logError, pageTracker } from '../utils/tools'
import { jumpUrlFunc, resetRoute } from '../utils/navigation'
import { getGlobalData } from '../conf/tools'

class LoginPage extends Component {

  constructor(props) {

    super(props)
    // 路由
    const { navigation } = props
    // 初始变量
    const { defAccount = '' } = getGlobalData('StartupParams') || {}
    // 登录账号
    this.defAccount = navigation.getParam('defAccount') || defAccount
    // 蒙层
    // this.loading = null
  }

  componentWillUnmount() {
    this.props.refreshLoginState()
  }

  // 登陆
  handleLogin = (params, callback) => {
    // 声明
    const { login, getInfoByPage } = this.props
    // 登录
    login(params).then(res => {
      // 结算确认
      if (typeof res === 'object' && res.resultCode === 'toBill') {
        // 跳转
        return jumpUrlFunc({ linkType: 3, linkUrl: 'Bill' })
      }
      // 初始化路由
      getInfoByPage(resetRoute())
      // 登录成功回调
      callback && callback()
    }).catch(error => {
      // 声明
      const { Message, message } = error || {}
      // 错误信息
      ;(Message || message) ? Toast.show({ text: Message || message }) : logError('login.error', error)
    })
  }

  render() {
    // 声明
    const { props: { list, removeUserInfo }, defAccount, handleLogin } = this

    return <Login login={handleLogin} list={list} removeUserInfo={removeUserInfo} defAccount={defAccount}/>
  }
}

const mapStateToProps = state => ({ list: state.userList })

const mapDispatchToProps = dispatch => bindActionCreators({
  login, removeUserInfo, refreshLoginState, getInfoByPage
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(pageTracker(LoginPage, 'Login'))
