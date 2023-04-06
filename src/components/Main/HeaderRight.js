import React, { PureComponent } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import isIPad from 'emrn-common/utils/isIPad'
import EmImage from 'emrn-common/components/EmImage'
import rpx from 'emrn-common/utils/rpx'
import { getSingleImg } from '../../images'
import { jumpUrlFunc } from '../../utils/navigation'

export default class HeaderRight extends PureComponent {
  constructor(props) {
    super(props)

    this.btnStyle = {
      width: rpx(100),
      height: isIPad ? 30 : 44,
      transform: [{ translateY: isIPad ? -10 : 0 }],
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'relative',
      paddingRight: rpx(24)
    }
    this.imgStyle = {
      width: 20,
      height: 20
    }
  }

  toSetting() {
    jumpUrlFunc({ linkType: 3, linkUrl: 'Setting' }, 'emtrade_maintrade_setting')
  }

  render() {
    const { btnStyle, imgStyle } = this
    return <TouchableWithoutFeedback onPress={this.toSetting}>
      <View style={btnStyle}>
        <EmImage source={getSingleImg('gear')} style={imgStyle}/>
      </View>
    </TouchableWithoutFeedback>
  }
}

