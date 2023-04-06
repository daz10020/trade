import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import isIPad from 'emrn-common/utils/isIPad'
import rpx from 'emrn-common/utils/rpx'
import { connect } from 'react-redux';
import { getUserInfo } from '../../store/reducers/user';

 class HeaderTitle extends PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    // 用户信息
    const userInfo = getUserInfo(this.props.userList)
    // 渲染
    return <View style={wrap}>
      <Text style={txtStyle}>{`期货交易-${userInfo && userInfo.name ? userInfo.name.replace(/./, '*') : ''}`}</Text>
    </View>
  }
}

const txtStyle = {
  fontSize: rpx(32),
  fontFamily: 'PingFangSC-Medium',
  color: '#fff',
  flex: 1,
  textAlign: 'center',
  marginTop: isIPad ? -10 : 0
}

const wrap = {
  flex: 1,
  height: isIPad ? 30 : 44,
  transform: [{ translateY: isIPad ? -10 : 0 }],
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
}

const mapStateToProps = state => ({ userList: state.userList })

export default connect(mapStateToProps)(HeaderTitle);
