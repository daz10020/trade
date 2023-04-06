import React, { Component } from 'react'
import { Animated, StyleSheet, View, Text, Platform, AppState, Keyboard, TouchableHighlight } from 'react-native'
import rpx from 'emrn-common/utils/rpx'
import { getGlobalData } from '../../conf/tools'


export default class Popup extends Component {
  static defaultProps = {
    options: {}
  }

  constructor(props) {
    super(props);
    // 主题
    this.theme = getGlobalData('Theme')

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

  componentWillUnmount() {
  }


  render() {
    const { props:{visibility, options}, theme} = this
    const {
      title,
      titleStyle,
      contentStyle,
      containerStyle,
      buttons,
      onCancel,
      onOk,
      message
    } = options

    let themeStyles = {}
    let underlayColor = '#eee'
    let rightBtnTextStyle = styles.rightBtnTextOrange
    if (theme === 'black' || theme === 'b') {
      underlayColor = '#202020'
      rightBtnTextStyle = styles.rightBtnText
      themeStyles = {
        leftBtnText: {
          color: '#999'
        },
        modalContainer: {
          backgroundColor: '#171717'
        },
        modalTitle: {
          color: '#e5e5e5'
        },
        text: {
          color: '#e5e5e5'
        },
        horizonLine: {
          backgroundColor: '#262626'
        },
        verticalLine: {
          backgroundColor: '#262626'
        },
      }
    }

    let messageComponent
    if (typeof message === 'string') {
      messageComponent = (
        <View style={styles.textWrap}>
          <Text style={[styles.text, themeStyles.text]}>{message}</Text>
        </View>
      )
    } else {
      messageComponent = message
    }

    return (
      !visibility ? null : <View style={styles.wrap}>
        <View style={[styles.container, themeStyles.container]}>
          <Animated.View
            style={[styles.modalContainer, themeStyles.modalContainer, containerStyle]}>
            <Text
              style={[
                styles.modalTitle,
                themeStyles.modalTitle,
                !title && { paddingBottom: 0, height: 0 },
                titleStyle
              ]}>
              {title}
            </Text>
            <View style={[styles.content, contentStyle]}>
              <View>{messageComponent}</View>
            </View>
            <View style={[styles.horizonLine, themeStyles.horizonLine]} />
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.leftBtn}
                onPress={onCancel}
                underlayColor={underlayColor}>
                <Text style={[styles.leftBtnText, themeStyles.leftBtnText]}>
                  {buttons[0]}
                </Text>
              </TouchableHighlight>
              <View style={[styles.verticalLine, themeStyles.verticalLine]} />
              <TouchableHighlight
                style={styles.rightBtn}
                onPress={onOk}
                underlayColor={underlayColor}>
                <Text style={rightBtnTextStyle}>{buttons[1]}</Text>
              </TouchableHighlight>
            </View>
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center'
    // alignItems: 'center'
  },
  modalContainer: {
    marginLeft: rpx(71),
    marginRight: rpx(71),
    borderRadius: rpx(14),
    backgroundColor: 'white',
    overflow: 'hidden'
    // alignItems: 'center'
  },
  modalTitle: {
    textAlign: 'center',
    color: '#282828',
    fontSize: rpx(34),
    lineHeight: rpx(50),
    fontWeight: '500',
    paddingTop: rpx(48),
    paddingBottom: rpx(28)
  },
  content: {
    paddingHorizontal: Math.min(rpx(24), 24),
    paddingBottom: rpx(48)
  },
  textWrap: {
    alignItems: 'center'
  },
  text: {
    paddingHorizontal: Math.min(rpx(20), 20),
    color: '#333',
    lineHeight: rpx(46),
    fontSize: rpx(30)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  horizonLine: {
    backgroundColor: '#eee',
    height: Platform.OS === 'web' ? 1 : rpx(1),
    alignSelf: 'stretch'
  },
  verticalLine: {
    backgroundColor: '#eee',
    width: 0.5,
    alignSelf: 'stretch'
  },
  leftBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftBtnText: {
    lineHeight: rpx(98),
    fontSize: rpx(34),
    color: '#333',
    textAlign: 'center'
  },
  rightBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightBtnText: {
    lineHeight: rpx(98),
    fontSize: rpx(34),
    color: '#3381e3',
    textAlign: 'center'
  },
  rightBtnTextOrange: {
    lineHeight: rpx(98),
    fontSize: rpx(34),
    color: '#ea5504',
    textAlign: 'center'
  },
  rightBtnTextGolden: {
    lineHeight: rpx(98),
    fontSize: rpx(34),
    color: '#E1A35E',
    textAlign: 'center'
  },
  oneBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
