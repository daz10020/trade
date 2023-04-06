//
// const modules = {}
// // 读取所有js文件
// const requireModule = require.context('./modules', false, /\.js$/)
// requireModule.keys().forEach(fileName => {
//   const moduleName = fileName.replace(/(\.\/|\.js)/g, '')
//   modules[moduleName] = requireModule(fileName).default
// })

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import thunkMiddleware from 'redux-thunk'
import getReducers from './reducers'
// import logger from 'redux-logger'

//生成store对象
//内部会第一次调用reducer函数，得到初始state
export default createStore(
  getReducers(),
  // applyMiddleware(thunk, thunkMiddleware, logger)
  applyMiddleware(thunk, thunkMiddleware)
)

// export default _ => createStore(
//   getReducers(),
//   applyMiddleware(thunk, thunkMiddleware, logger)
// )

// store.dispatch(selectSubreddit('reactjs'))

