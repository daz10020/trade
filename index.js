/* app 入口 */
import './shim.js'
// import './src/conf/initial.js'
import { AppRegistry } from 'em-react-native'
import App from './src/App'
import RootSiblingParent from 'emrn-common/components/RootSiblingParent'

console.disableYellowBox = true;

AppRegistry.registerComponent('EMApp', () => RootSiblingParent(App));
