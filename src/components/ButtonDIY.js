import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

export default props => {
  const { btnStyle, txtStyle, title, onClick, children } = props
  // return <TouchableWithoutFeedback accessibilityRole={'button'} onPress={_ => console.log('ddddddddddddd')}>
  return <TouchableWithoutFeedback onPress={onClick}>
    <View style={btnStyle}>
      {
        children ? children : <Text style={txtStyle}>{title}</Text>
      }
    </View>
  </TouchableWithoutFeedback>
}
