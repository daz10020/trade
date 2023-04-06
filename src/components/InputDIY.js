// import React, { PureComponent } from 'react';
// import { View, Platform, TouchableWithoutFeedback, StyleSheet, TextInput, Text } from 'react-native'
// import EmImage from 'emrn-common/components/EmImage'
// import rpx from 'emrn-common/utils/rpx'
// import { getSingleImg } from '../images/index'
// import { getColors } from '../style'

// 安卓
// const isAndroid = Platform.OS === 'android'


// export default class InputDIY extends PureComponent {
//   constructor(props) {
//     super(props)
//     // 图片
//     this.iconImg = getSingleImg('cls')
//     // 颜色
//     const { placeholder, txt } = getColors('placeholder,txt')
//     // 颜色
//     this.colors = {
//       placeholder,
//       txt: {
//         color: txt
//       }
//     }
//     // 输入框
//     this.inp = null
//   }
//
//   // 价格框
//   // setRef = e => this.inp = e
//
//   // 清理
//   handleClickClear = _ => {
//     const { onChangeText } = this.props
//     typeof onChangeText === 'function' && onChangeText('')
//   }
//
//   render() {
//     // 声明
//     const { iconImg, colors: { placeholder, txt }, props, handleClickClear, setRef } = this
//     // 配置
//     const { wrapStyle, value, style, clearButtonMode = 'always', unit, unitWrapStyle, unitStyle } = props
//     // 样式
//     const { box, inp, icon, hide, padding, iconWrap } = styles
//     // 渲染
//     return <View style={[box, isAndroid && value ? padding : null, wrapStyle]}>
//       <TextInput
//         // ref={setRef}
//         placeholder={'输入代码、名称或简拼'}
//         underlineColorAndroid="transparent"
//         placeholderTextColor={placeholder}
//         clearButtonMode={clearButtonMode}
//         {...props}
//         style={[isAndroid ? inp : null, txt, style]}
//       />
//       {
//         Boolean(unit) &&
//         <View style={[iconWrap, unitWrapStyle]}>
//           <Text style={unitStyle}>{value ? unit : ''}</Text>
//         </View>
//       }
//       {
//         isAndroid && clearButtonMode && clearButtonMode !== 'never' &&
//         <TouchableWithoutFeedback onPress={handleClickClear}>
//           <View style={iconWrap}>
//             <EmImage source={iconImg} resizeMode={'contain'} style={[icon, value ? null : hide]}/>
//           </View>
//         </TouchableWithoutFeedback>
//       }
//     </View>
//   }
// }
//
// const styles = StyleSheet.create({
//   box: {
//     flex: 1,
//     height: '100%',
//     position: 'relative',
//     zIndex: 1,
//     justifyContent: 'center',
//   },
//   padding: {
//     paddingRight: rpx(50)
//   },
//   hide: {
//     width: 0,
//     height: 0
//   },
//   iconWrap: {
//     position: 'absolute',
//     right: rpx(6),
//     top: 0,
//     height: '100%',
//     width: rpx(30),
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   icon: {
//     width: rpx(30),
//     height: rpx(30),
//   },
//   inp: {
//     padding: 0
//   }
// })
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native'
import InputAndroid from './InputAndroid'
import InputIos from './InputIos'
import InputLoginIos from './InputLoginIos'
import rpx from 'emrn-common/utils/rpx'
import { getSingleImg } from '../images/index'
import { getColors } from '../style'

export default class InputDIY extends PureComponent {
  constructor(props) {
    super(props)
    // 图片
    this.iconImg = getSingleImg('cls')
    // 颜色
    const { placeholder, txt } = getColors('placeholder,txt')
    // 赋值
    this.defColor = {
      placeholder,
      txtColor: { color: txt }
    }
    // // 输入框
    // this.inp = null
  }

  // 价格框
  // setRef = e => this.inp = e

  render() {
    // 声明
    const { defColor: { placeholder, txtColor }, props, setRef } = this
    // 配置
    const { wrapStyle, androidWrapStyle, value, style: inpStyle, unit, unitWrapStyle, unitStyle, isLogin } = props
    // 安卓
    const Input = Platform.OS === 'android' ? InputAndroid : ( isLogin? InputLoginIos : InputIos)
    // 样式
    const { box, iconWrap } = styles
    // 渲染
    return <View style={[box, wrapStyle]}>
      <Input
        underlineColorAndroid="transparent"
        placeholderTextColor={placeholder}
        androidWrapStyle={androidWrapStyle}
        inpStyle={[txtColor, inpStyle]}
        {...props}
      />
      {
        Boolean(unit) && <View style={[iconWrap, unitWrapStyle]}>
          <Text style={unitStyle}>{value ? unit : ''}</Text>
        </View>
      }
    </View>
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    height: '100%',
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
  },
  padding: {
    paddingRight: rpx(50)
  },
  hide: {
    width: 0,
    height: 0
  },
  iconWrap: {
    position: 'absolute',
    right: rpx(6),
    top: 0,
    height: '100%',
    width: rpx(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: rpx(30),
    height: rpx(30),
  },
  inp: {
    padding: 0
  }
})
