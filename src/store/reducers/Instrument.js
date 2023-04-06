// import {
//   SET_INSTRUMENT_LIST,
// } from '../actions/Types'
//
// const initState = {
//   list: [],
//   time: 0
// }
//
// // 持仓列表
// export const Instrument = (state = initState, action) => {
//   // 声明
//   const { type, ...data } = action
//   switch (type) {
//     // 初始化
//     case SET_INSTRUMENT_LIST:
//       // 声明
//       const { list = [], time = new Date().getTime() } = data
//       // 更新
//       return { list, time }
//     default:
//       return state
//   }
// }
//
// // // 返回可撤单列表
// // export const getInstrumentsByIds = (state, uids) => {
// //   // 是否为单个
// //   const singleFlg = !Array.isArray(uids)
// //   // 统一数组
// //   const ids = singleFlg ? [uids] : uids
// //   // 内容
// //   const { Instrument } = state
// //   // 筛选
// //   const res = Instrument.filter(item => ids.some(id => id === item.InstrumentID))
// //   // 返回
// //   return singleFlg && res.length ? res[0] : res
// // }
