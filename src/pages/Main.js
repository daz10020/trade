import React, { PureComponent } from 'react';
import { pageTracker } from '../utils/tools'
import MainTab from '../components/Main'
import { loginOut, removeUserInfo } from '../store/actions/user'
import * as FundsActions from '../store/actions/funds'
import { setStore } from '../store/actions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getGlobalData } from '../conf/tools';

class MainPage extends PureComponent {

  constructor(props) {
    super(props)
    // 初始变量
    const { tab = 0 } = getGlobalData('StartupParams') || {}
    // tab角标
    this.tab = props.navigation.getParam('tab') || tab
    // state
    this.state = {}
  }

  render() {
    const {
      tab,
      props: { userList, loginOut, removeUserInfo, navigation, ...Store }
    } = this

    return <MainTab {...Store} tab={tab} interval={500}/>
  }
}

const mapStateToProps = state => {
  // 声明
  const { Positions, Deal, Entrustment, Funds, userList } = state
  // 返回
  return ({ userList, Positions, Deal, Entrustment, Funds })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  ...FundsActions,
  loginOut, removeUserInfo, setStore
}, dispatch)
export default pageTracker(connect(mapStateToProps, mapDispatchToProps)(MainPage), 'Main');
