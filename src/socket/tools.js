// 'use static'
// import Structs from './Structs'
// import { Alert } from 'react-native'
//
// // 获取包结构
// const getStruct = code => typeof code === 'string' ? Structs[code] || Structs.base : code
// // 打包
// export const stringify = (json, structType, zlength) => {
//   // 声明
//   let buffer = new ArrayBuffer(zlength || 999)
//   let dv = new DataView(buffer)
//   // 配置
//   const conf = getStruct(structType)
//   // 合并
//   const slength = conf.reduce((acc, cur) => {
//     // 声明
//     const { key, len, type } = cur
//     let val = json[key]
//     // 格式化
//     if (/^Uint/i.test(type)) { // Uint
//       dv[`set${type}`](acc, val)
//     } else if (/^Int/i.test(type)) { // Int
//       dv[`set${type}`](acc, val, true)
//     } else if (type === 'long') { // Long
//       dv.setBigInt64(acc, val, true)
//     } else if (type === 'string') { // String
//       [...val].forEach((i, idx) => dv.setUint8(acc + idx, i.codePointAt()))
//     } else if (type === 'buffer') { // Buffer
//       // 已转码截取
//       const o = new Uint8Array(buffer.slice(0, acc))
//       // 判断类型
//       const v = val.length === undefined ? new Uint8Array(val) : val
//       // 赋值
//       buffer = new Uint8Array([...o, ...v]).buffer
//     }
//     return acc + (len || val.length || val.byteLength)
//   }, 0)
//   // 截取
//   return zlength ? buffer : buffer.slice(0, slength)
// }
//
// // 解包
// export const parse = (buffer, structType) => {
//   // 转码
//   const conf = getStruct(structType)
//   const dv = new DataView(buffer);
//   // 声明
//   const res = {}
//   // 拆分
//   conf.reduce((acc, cur) => {
//     // 声明
//     const { key, len, type } = cur
//     // 进制
//     let val = 0
//     // 格式化
//     if (/^Uint/i.test(type)) { // Uint
//       val = dv[`get${type}`](acc)
//     } else if (/^Int/i.test(type)) { // Int
//       val = dv[`get${type}`](acc, true)
//     } else if (type === 'long') { // Long
//       val = dv.getBigInt64(acc, true)
//     } else if (type === 'string') { // String
//       // 截取
//       const bs = len ? buffer.slice(acc, acc + len) : buffer.slice(acc)
//       // 解码
//       val = String.fromCharCode(...new Uint8Array(bs))
//     } else if (type === 'buffer') { // Buffer
//       val = buffer.slice(acc)
//     }
//     res[key] = val
//     // 循环
//     return acc + (len || val.length || val.byteLength)
//   }, 0)
//   return res
// }
//
// export const hex2buffer = hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))).buffer
//
// export const buffer2hex = buffer => {
//   // 判断类型
//   const ar = buffer.length === undefined ? new Uint8Array(buffer) : buffer
//   // 转码
//   return [...ar].map(c => `00${c.toString(16)}`.slice(-2)).join('')
// }
//
// const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
// const cb_btou = cccc => {
//   switch(cccc.length) {
//     case 4:
//       let cp = ((0x07 & cccc.charCodeAt(0)) << 18)
//         |    ((0x3f & cccc.charCodeAt(1)) << 12)
//         |    ((0x3f & cccc.charCodeAt(2)) <<  6)
//         |     (0x3f & cccc.charCodeAt(3)),
//         offset = cp - 0x10000;
//       return (String.fromCharCode((offset  >>> 10) + 0xD800)
//         + String.fromCharCode((offset & 0x3FF) + 0xDC00));
//     case 3:
//       return String.fromCharCode(
//         ((0x0f & cccc.charCodeAt(0)) << 12)
//         | ((0x3f & cccc.charCodeAt(1)) << 6)
//         |  (0x3f & cccc.charCodeAt(2))
//       );
//     default:
//       return  String.fromCharCode(
//         ((0x1f & cccc.charCodeAt(0)) << 6)
//         |  (0x3f & cccc.charCodeAt(1))
//       );
//   }
// }
//
// export const btou = b => b.replace(re_btou, cb_btou)
