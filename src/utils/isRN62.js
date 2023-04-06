import { Platform } from 'react-native'
const { constants } = Platform
const isRN62 = constants && constants.reactNativeVersion && constants.reactNativeVersion.minor === 62

export default isRN62
