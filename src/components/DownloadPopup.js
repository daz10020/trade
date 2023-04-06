import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Platform,
  AppState,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native'
import rpx from 'emrn-common/utils/rpx'
import { Router, Container, Passport } from 'emrn-common/utils/hybrid'
import EmImageBackground from 'emrn-common/components/EmImageBackground'
import EmImage from 'emrn-common/components/EmImage'
import RootSiblings from 'react-native-root-siblings'
import { jumpUrlFunc } from '../utils/navigation'
import { getGlobalData } from '../conf/tools'
import linkTracker from '../utils/LinkTracker'
import { logError } from '../utils/tools'
import http from '../apis'

class DownloadPopup extends Component {
  static defaultProps = {
    options: {}
  }

  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState
    };
  }

  componentDidMount() {
    // 收起键盘
    setTimeout(() => {
      Keyboard.dismiss()
    }, 30)
  }

  render() {
    const { visibility, options } = this.props
    const {
      buttons = [],
      onCancel,
      onOk,
    } = options
    const {
      rightBtnText, modalTitle, wrap, row, modalContainer,
      leftBtn, leftBtnText, rightBtn, gif, txt
    } = styles

    return !visibility ? null : <View style={wrap}>
      <Animated.View>
        <EmImageBackground style={modalContainer} source={require('../images/download-popup-bg.png')}>
          <Image source={require('../images/download-points-1.gif')} resizeMode="contain" style={gif}/>
          <Text style={modalTitle}>即将前往东方财富期货APP</Text>
          {/*<Text style={txt}>如您尚未安装，将{Platform ? '进行' : '跳转至应用商店'}下载</Text>*/}
          <Text style={txt}>如您尚未安装，将跳转至应用商店下载</Text>
          <View style={row}>
            <TouchableWithoutFeedback onPress={onCancel}>
              <View style={leftBtn}>
                <Text style={leftBtnText}>{buttons[0] || '取消'}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onOk}>
              <View style={rightBtn}>
                <Text style={rightBtnText}>{buttons[1] || '确认'}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </EmImageBackground>
      </Animated.View>
    </View>
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: rpx(688),
    height: rpx(538),
    paddingTop: rpx(182),
    alignItems: 'center',
  },
  gif: {
    position: 'absolute',
    top: rpx(100),
    width: rpx(120),
    height: rpx(13),
  },
  modalTitle: {
    color: '#333',
    fontSize: rpx(40),
    lineHeight: rpx(58),
    fontWeight: '500',
    fontFamily: 'SourceHanSansSC-Bold',
    paddingTop: rpx(48),
    marginBottom: rpx(2)
  },
  txt: {
    color: '#666',
    fontSize: rpx(28),
    lineHeight: rpx(40),
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rpx(38),
  },
  leftBtn: {
    width: rpx(222),
    height: rpx(72),
    borderRadius: rpx(36),
    borderColor: '#EB6231',
    borderWidth: rpx(1)
  },
  leftBtnText: {
    fontSize: rpx(36),
    lineHeight: rpx(72),
    color: '#EB6231',
    textAlign: 'center'
  },
  rightBtn: {
    width: rpx(222),
    height: rpx(72),
    borderRadius: rpx(36),
    backgroundColor: '#EB6231',
    marginLeft: rpx(32)
  },
  rightBtnText: {
    fontSize: rpx(36),
    lineHeight: rpx(72),
    color: '#fff',
    textAlign: 'center'
  },
})

// 应用商店下载的打点参数
const getTrackInfo = async _ => {
  const { getDeviceInfo, } = Container 
  const { info: { uid: userId = '' } = {} } = await Passport.getUserInfo()
  const { euid, idfv = '', model: device = '', } = await getDeviceInfo()
  const platform = Platform.OS === 'ios'? 'ios': (Platform.OS === 'android'? 'android': '其他')
  // idfv ios才有；userId 拿到可能是空的
  return { userId, platform, euid, idfv, device, }
}

export default function (options) {
  // 声明
  const { trackEvent, scheme = 'eastmoneyqh://home', onOk, onCancel } = options
  // 初始化埋点
  trackEvent && linkTracker.add(options)
  // 关闭
  const destory = () => instance.destroy()
  // 覆盖配置
  options.onOk = () => {
    // 关闭
    destory()
    // 更新
    ;(typeof onOk === 'function' ? onOk : async _ => {
      // 跳转
      const { isInstall } = await Router.openApp({
        packageName: 'com.eastmoney.app.qhsjkh', scheme
      }) || {}
      // 已下载
      if (isInstall) return

      // 调应用商店打点
      const data = await getTrackInfo()
      await http.request('downloadTrack', JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      }).catch(e => {
        logError('download futuresAPP tracker error' ,e)
      })

      //
      Number((getGlobalData('AppInfo') || {}).appVersionCode) > 9007001 ? Router.openAppStoreWithId({
        packageName: Platform.OS === 'ios' ? '1214214120' : 'com.eastmoney.app.qhsjkh', scheme
      }) : jumpUrlFunc({
        linkType: 1,
        linkUrl: 'https://qhemrs.eastmoney.com/h5/Download/index.html'
      })
    })()
  }
  options.onCancel = () => {
    // 关闭
    destory()
    // 执行
    typeof onCancel === 'function' && onCancel()
  }
  const instance = new RootSiblings(
    <DownloadPopup options={options} visibility={true}></DownloadPopup>
  )
  return instance
}
