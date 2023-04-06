// 'use strict'
// import WS from './WS'
// import { stringify, parse, hex2buffer, buffer2hex, utf2str, base2buffer } from './tools'
// import { RSA, AES, pbkdf_sha256 } from './Crypto'
// import tools from '../utils/tools'
// import Pako from 'pako'
//
// import { Alert } from 'react-native'
//
// // 消息头
// const HEADER = {
//   headflag: 0xFD,
//   srvtype: 1,
//   major: 1,
//   headcrc: 0,
//   cipher: 1,
//   compress: 1
// }
//
// class Stocket {
//   // 构造函数
//   constructor(options) {
//     // ws对象
//     this.ws = null
//     // 配置
//     this.options = options
//     // 回调列表
//     this.callbacks = {}
//     // 会话id
//     this.sessid = 0
//     // aeskey
//     this.key = ''
//     // aes算法
//     this.aesDe = null
//     this.aesEn = null
//     // 初始化
//     this.init()
//   }
//
//   // 初始化
//   init() {
//     console.log('Stocketinit')
//     // 声明
//     const { _handshake, _responseInterceptors, _heartBeart } = this
//     // 生成秘钥
//     this.initKey()
//     // 建立连接
//     const { ws } = new WS({
//       // 地址
//       url: this.options.url,
//       // 延时
//       timeOut: 10000,
//       // 接通握手
//       onOpen: _handshake,
//       // 部署拦截器
//       onMsg: _responseInterceptors,
//       // 心跳
//       heartBeart: _heartBeart
//     })
//     // 赋值
//     this.ws = ws
//   }
//
//   // 初始化秘钥
//   initKey() {
//     // 声明
//     const { encrypt, decrypt } = AES
//     // 秘钥
//     const randomStr = tools.randomRange(20)
//     // 盐
//     const salt = 'abcdefdf'
//     // 派生
//     const code = pbkdf_sha256(randomStr, salt, 2048, 48)
//     // 截取
//     const key = code.slice(0, 32)
//     const iv = code.slice(32)
//     // 赋值
//     this.aesEn = json => encrypt(json, key, iv)
//     this.aesDe = content => decrypt(content, key, iv)
//     this.key = randomStr
//   }
//
//
//   // 发送消息
//   send = config => {
//     // 声明
//     const { _createReqHeader, ws } = this
//     // 格式化
//     const params = _createReqHeader(config)
//     console.log(params)
//     // 格式化
//     const res = stringify(params, 'header')
//     console.log('req')
//     console.log(res)
//     // 发送
//     ws.send(res)
//   }
//
//   // 响应拦截器
//   _responseInterceptors = response => {
//     console.log(response)
//     const { aesDe, callbacks, _resulteFormatter } = this
//     // 执行
//     const { content, packType, packid } = parse(response.data, 'header')
//     // 查询参数
//     const { cb, isSpecial } = callbacks[`cb_${packid}`] || {}
//     console.log('content')
//     console.log(content)
//     if (!cb) return
//     // 非业务包
//     if (isSpecial) {
//       return cb(content.byteLength ? parse(content, `res${packType}`) : packType)
//     }
//     // 解压解密
//     const buffer = Pako.inflate(aesDe(buffer2hex(content))).buffer
//     // 解包
//     const { sessid, data } = parse(buffer, `res${packType}`)
//     // 更新
//     this.sessid = sessid
//     // 格式化结果
//     const res = _resulteFormatter(data)
//     console.log(res)
//     // 执行
//     typeof cb === 'function' && cb(res)
//   }
//
//   // 生成请求头
//   _createReqHeader = config => {
//     // 会话id
//     const { sessid, callbacks, aesEn } = this
//     const { extParams, structType, data, cb, cbKey } = config
//     console.log(config)
//     // 字节包
//     let buffer = extParams ? stringify(extParams, `req${structType}`) : new ArrayBuffer(0)
//     // 业务数据
//     if (data && extParams === undefined) {
//       // 业务数据压缩
//       const jsonStr = JSON.stringify(data)
//       // 业务包
//       const contBuffer = stringify({
//         sessid, data: jsonStr, datalen: jsonStr.length
//       }, 'base')
//       // 压缩加密
//       buffer = aesEn(Pako.deflate(new Uint8Array(contBuffer)))
//     }
//     // 长度
//     const len = buffer.byteLength
//     // 请求id
//     const packid = cbKey || Object.keys(callbacks).length
//     // 添加回调(心跳包除外)
//     cb && (callbacks[`cb_${packid}`] = { isSpecial: extParams || extParams === false, cb })
//     // 返回
//     return {
//       ...HEADER,
//       // 接口类型
//       packType: structType,
//       // 包id
//       packid,
//       // 包长
//       len,
//       // 原包长
//       slen: len,
//       // 包
//       content: buffer
//     }
//   }
//
//   // 绑定监听
//   _handshake = _ => {
//     const { send, key, options: { onReady, onError } } = this
//     // 97
//     const req97 = res => {
//       const buffer = new Buffer.from(RSA.encrypt(key, res.cipher_data), 'base64')
//       send({
//         structType: 97,
//         extParams: {
//           ...res,
//           cipher_len: buffer.byteLength,
//           cipher_data: buffer
//         },
//         cb: res => {
//           console.log(res)
//           res.cipher_data === 0 ? onReady(res) : onError(res)
//         }
//       })
//     }
//     // 96
//     send({
//       structType: 96,
//       extParams: false,
//       cb: req97
//     })
//   }
//
//   // 重连
//   _heartBeart = _ => {
//     return
//     console.log('_heartBeart')
//     // 心跳
//     this.send({
//       structType: 0xF,
//       extParams: false,
//       cbKey: -1
//     })
//   }
//
//   // 断开
//   _close = _ => {
//     console.log('c_close')
//     const { ws } = this
//     // 断开链接
//     ws && ws._close()
//   }
//
//   _resulteFormatter = res => {
//     const json = JSON.parse(res)
//     const { Message } = json
//     return {
//       ...json,
//       msg: Message ? utf2str(Message) : ''
//     }
//   }
// }
//
// export default Stocket
