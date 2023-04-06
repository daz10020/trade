import React from 'react'
import { ScrollView, View, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Text, Dimensions } from 'react-native'
import HTMLView from 'react-native-htmlview';
import rpx from 'emrn-common/utils/rpx'

export default props => {
  // 单据内容
  const { handleVerify, html } = props
  const { form, button, buttonTxt, wrap } = styles
  // 报错 则不显示
  const conf = html === '212' || html === 'error' ? {
    value: '<p>上一交易日结算单不存在，<br>请点击确认按钮后即可进行交易</p>',
    stylesheet: errorStyles
  } : {
    value: html,
    stylesheet: { flex: 1 }
  };
  // 渲染
  return !html ? null : <SafeAreaView style={wrap}>
    <View style={form}>
      <ScrollView>
        <ScrollView horizontal>
          <HTMLView {...conf}/>
        </ScrollView>
      </ScrollView>
    </View>
    <TouchableWithoutFeedback onPress={handleVerify}>
      <View style={button}>
        <Text style={buttonTxt}>{'确认'}</Text>
      </View>
    </TouchableWithoutFeedback>
  </SafeAreaView>
}

const errorStyles = StyleSheet.create({
  p: {
    width: Dimensions.get('screen').width,
    textAlign: 'center',
    marginTop: 80
  }
})

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  form: {
    flex: 1,
    backgroundColor: '#fff'
  },
  button: {
    height: rpx(80),
    backgroundColor: '#3381E3',
    margin: rpx(20),
    borderRadius: rpx(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTxt: {
    color: '#fff',
    fontSize: rpx(34),
    fontFamily: 'PingFangSC-Regular'
  }
});
