import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { getColors } from '../style';
import { rpx } from 'emrn-common/utils';
import ButtonDIY from '../components/ButtonDIY';
import { formatDateTime } from 'emrn-common/utils/format';
import { refreshInstrument, getInstrumentsUpdTime } from '../conf/Instrument';
import { Toast } from 'emrn-common/utils/hybrid';


export default class SettingPage extends PureComponent {

  constructor(props) {
    super(props)
    // 创建
    Object.assign(this, {
      // 样式
      styles: getCss(),
      // 状态
      state: {
        dt: formatDateTime(getInstrumentsUpdTime(), 'yyyy/MM/dd HH:mm:ss')
      }
    })
  }

  handleRefreshInstrument = _ => {
    // 更新
    refreshInstrument(true).then(res => {
      // 更新时间
      this.setState({
        dt: formatDateTime(new Date(), 'yyyy/MM/dd HH:mm:ss')
      })
      // 提示连接失败
      Toast.show({ text: '码表更新成功！' })
    }).catch(e => {
      console.log(e)
      // 提示连接失败
      Toast.show({ text: '码表更新失败！' })
    })
  }

  render() {
    // 声明
    const {
      styles: { wrap, tr, cont, tit, txt, btnWrap, btnTxt },
      handleRefreshInstrument,
      state: { dt }
    } = this
    // 渲染
    return <SafeAreaView style={wrap}>
        <View style={tr}>
            <View style={cont}>
                <Text style={tit}>当前码表更新时间</Text>
                <Text style={txt}>{`上次更新时间: ${dt}`}</Text>
            </View>
            <ButtonDIY title={'更新'} btnStyle={btnWrap} txtStyle={btnTxt} onClick={handleRefreshInstrument}/>
        </View>
    </SafeAreaView>
  }
}


const getCss = _ => {
  // 当前皮肤
  const { setting: { bg, txt }, homeBg, txt: tit, themeColor } = getColors('setting,homeBg,txt,themeColor')

  return StyleSheet.create({
    wrap: {
      flex: 1,
      // paddingTop: rpx(10),
      backgroundColor: bg,
    },
    tr: {
      paddingTop: rpx(12),
      paddingBottom: rpx(12),
      paddingLeft: rpx(30),
      paddingRight: rpx(30),
      backgroundColor: homeBg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tit: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(30),
      color: tit,
      lineHeight: rpx(48)
    },
    txt: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: rpx(26),
      color: txt,
      lineHeight: rpx(48)
    },
    btnWrap: {
      width: rpx(100),
      height: rpx(50),
      backgroundColor: themeColor,
      borderRadius: rpx(6),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnTxt: {
      color: '#fff'
    }
  })
}
