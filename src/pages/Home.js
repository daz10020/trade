import React, { PureComponent } from 'react'
import { shouldUpdate, pageTracker } from '../utils/tools'
import { loginOut, removeUserInfo } from '../store/actions/user'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UserBar from '../components/UserBar'
import Header from '../components/Home/Header'
import Icons from '../components/Home/Icons'
import TelBox from '../components/TelBox'
import { View } from 'react-native'
import { getUserInfo } from '../store/reducers/user'
import EmLoading from 'emrn-common/components/EmLoading'

class HomePage extends PureComponent {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // 蒙层
    const loading = EmLoading('数据载入中')
    // 初始化本地缓存
    // const { initialUserList } = this.props
    // // 用户信息
    // initialUserList()
    // 清理蒙层
    loading.destroy()
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.onAppStateChange);
  }

  render() {
    const { fastLogin, loginOut, removeUserInfo, userList, navigation } = this.props
    // 用户信息
    const userInfo = getUserInfo(userList)
    return <View>
      <Header/>
      <UserBar
        navigation={navigation}
        userList={userList}
        fastLogin={fastLogin}
        loginOut={loginOut}
        removeUserInfo={removeUserInfo}
      />
      <Icons list={['交易', '资金', '委托', '银期']} isLogin={userInfo}/>
      <TelBox/>
    </View>
  }
}

const mapStateToProps = state => ({ userList: state.userList })

const mapDispatchToProps = dispatch => bindActionCreators({
  loginOut, removeUserInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(pageTracker(HomePage, 'Home'));
