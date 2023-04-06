'use strict'
import { stringify, parse, hex2buffer, buffer2hex, initCollectInfo, _resulteFormatter, initDeviceParams } from './tools'
import { RSACls, AESCls } from './Crypto'
import Pako from 'pako'
import Queue from './Queue'
import RequestQueue from './RequestQueue'
import DelayQueue from './DelayQueue'
import { randomRange, logError } from '../utils/tools'

export default class TradeReq {

  // 构造函数
  constructor(options) {
    // 合并
    Object.assign(this, {
      // 消息头
      HEADER: {
        headflag: 0xFD,
        srvtype: 1,
        major: 1,
        headcrc: 0,
        cipher: 1,
        compress: 1
      },
      // ws对象
      ws: null,
      // 配置
      options: options,
      // 会话id
      sessid: 0,
      // 线路
      serverType: '',
      // 报单引用
      orderRef: 1,
      // aes算法
      aesDe: null,
      aesEn: null,
      // rsa算法
      rsaEn: null,
      // 公共参数
      commonParams: {},
      DeviceParams: {},
      ClientAppID: '',
      ClientSystemInfo: '',
      // 队列
      queue: null,
      // 查询请求限流
      selReqQueue: null,
      // 交易请求限流
      tradeReqQueue: null,
      // 推送消息
      _receiver: null
    })
    // 初始化
    this.initRandom()
    // // 穿透式监管信息
    // this.initCollectInfo()
  }

  initParams = globalData => {
    // 数据
    const { ClientAppID, ...DeviceParams } = initDeviceParams(globalData)
    // 更新
    Object.assign(this, { ClientAppID, DeviceParams })
    // 穿透式监管信息
    this.initCollectInfo()
  }

  // 穿透式监管信息
  initCollectInfo = async flg => {
    // 声明
    const { ClientSystemInfo, ClientAppID } = this
    // 请求
    !ClientSystemInfo && (this.ClientSystemInfo = await initCollectInfo(flg, ClientAppID))
  }

  // 初始化
  initRandom() {
    // console.log('TradeReqinit')
    // 声明
    const { _send } = this
    // 秘钥
    const randomStr = randomRange(20)
    // AES
    const { aesEn, aesDe } = new AESCls({ salt: 'abcdefdf', randomStr })
    // RSA
    // RSA.encrypt(key, res.cipher_data)
    const rsa = new RSACls({ randomStr })
    // 更新
    Object.assign(this, {
      // aes
      aesEn, aesDe,
      // rsa
      rsaEn: publicKey => rsa.encrypt(randomStr, publicKey),
      // 队列
      queue: new Queue(),
      // 查询请求限流
      selReqQueue: new RequestQueue({ space: 1, func: _send }),
      // 交易请求限流
      tradeReqQueue: new RequestQueue({ space: 0.1, func: _send }),
      // 交易请求限流
      delayReqQueue: new DelayQueue({ delay: 2000, space: 1000, func: _send }),
    })
  }

  // 生成请求头
  _requestInterceptors = options => {
    // 事务
    const { _send, selReqQueue, tradeReqQueue, delayReqQueue } = this
    // 请求参数
    const { messageID, reqConf: { isDelay }, onError } = options
    // console.log(options)
    // 查询限流
    if (isDelay) {
      // 延时请求
      return delayReqQueue.enqueue(messageID, options, onError)
    } else if (/^3/.test(messageID)) {
      // if (Number(messageID) > 30003) {
      return selReqQueue.enqueue(options)
    } else if (/^2000/.test(messageID)) {
      return tradeReqQueue.enqueue(options)
    } else {
      // 直接发送
      _send(options)
    }
  }

  // 响应拦截器
  _responseInterceptors = response => {
    // 声明
    const { aesDe, sessid: sessid_o, queue, _receiver, serverType: oServerType } = this
    // 执行
    const { content, packType, packid } = parse(response.data, 'header')
    // console.log('-------------res_packid----------------')
    // console.log(packid)
    // 查询参数
    const { onSuccess, onError, isSpecial, reqConf, _messageID } = queue.dequeue(packid) || {}
    // 无回调
    if (!onSuccess && !onError && packType !== 2) return
    // 非业务包
    if (isSpecial && onSuccess) {
      return onSuccess(content.byteLength ? parse(content, `res${packType}`) : packType)
    }
    // 解压解密
    const buffer = Pako.inflate(hex2buffer(aesDe(buffer2hex(content)))).buffer
    // 解包 ServerType 0-灾备线、1-正式线
    const { sessid, data, ServerType } = parse(buffer, `res${packType}`) || {}
    // 更新
    Object.assign(this, { sessid, serverType: ServerType })
    try {
      // 格式化结果
      const json = JSON.parse(data)
      // console.log(json)
      // 响应ID
      const { messageID } = json
      // 日志
      messageID !== '30013' && logError('TradeReq.rsp', messageID, 'info')
      // 切换线路
      if(messageID === '10001' && oServerType === 0 && ServerType === 1) {
        // 通知确认结算单
        json.hasChangeLine = true
      }
      // 推送消息
      if (packType === 2) return _receiver(json)
      // 回调
      messageID === _messageID && _resulteFormatter(json, reqConf).then(onSuccess).catch(e => onError(e))
    } catch (e) {
      // 弹出错误
      onError(e)
      // 错误日志
      logError('TradeReq.resParseJson', e)
    }
  }

  // 发送
  _send = options => {
    // 声明
    const { ws, queue, HEADER } = this
    // 请求参数
    const { buffer = new ArrayBuffer(0), packType = 1 } = options
    // 入列
    const packid = queue.enqueue(options)
    // console.log('-------------req_packid----------------')
    // console.log(packid)
    // 日志
    // packid !== -1 && logError('TradeReq.req', options, 'info')
    // 长度
    const len = buffer.byteLength
    // 格式化
    const params = stringify({
      // 公共头
      ...HEADER,
      // 接口类型、包id、包长、原包长
      packType, packid, len, slen: len,
      // 包内容
      content: buffer
    }, 'header')
    // 发送
    ws && ws._send(params)
  }

  // 绑定监听
  _handshake = _ => {
    // console.log('_handshake')
    // 声明
    const { _send, rsaEn } = this
    // 返回
    return new Promise((resolve, reject) => {
      // 发出握手请求
      _send({
        packType: 96,
        // 确认连接，并登录
        onSuccess: res => {
          // const buffer = new Buffer.from(RSA.encrypt(key, res.cipher_data), 'base64')
          const buffer = new Buffer.from(rsaEn(res.cipher_data), 'base64')
          _send({
            packType: 97,
            buffer: stringify({
              ...res,
              cipher_len: buffer.byteLength,
              cipher_data: buffer
            }, 'req97'),
            onSuccess: res => {
              // 握手完成
              typeof res === 'object' && res.cipher_data === 0 ? resolve(res) : reject(res)
            }
          })
        }
      })
    })
  }

  // 重置
  _clear = _ => {
    // console.log('_tradeReq_clear')
    // 重置
    // this.setUserId(undefined)
    // 清空队列
    this.queue._clear()
    // 清空队列
    this.selReqQueue._clear()
    // 清空队列
    this.tradeReqQueue._clear()
  }

  // 更新公共函数
  setUserId = userId => {
    // console.log('_tradeReq_setUserId')
    // 声明
    const { ClientSystemInfo, DeviceParams } = this
    // 合并
    this.commonParams = { ...DeviceParams, ClientSystemInfo, UserID: userId, InvestorID: userId, AccountID: userId }
  }

  // 更新单号
  // updOrderRef = _ => ++this.orderRef

  /**
   * ws交互
   *
   * @param {string} MessageID - 缓存名称
   * @param {object} data - 请求参数
   * @param {object} reqConf - 请求配置
   * @param {boolean} reqConf.[isDetail] - 是否为单条数据
   * @param {boolean} reqConf.[hideErrorMsg] - 隐藏错误提示
   * @param {boolean} reqConf.[ignoreEmpty] - 忽略空值错误
   *
   * @returns {Promise<object>}
   *
   */
  request = (MessageID, data = {}, reqConf = {}) => {
    // console.log(this)
    try {
      // 声明
      const { sessid, aesEn, commonParams, ClientAppID, _requestInterceptors } = this
      // 未登录 不请求
      if (!commonParams.UserID) return null
      // 交易单号
      // console.log({ ...commonParams, MessageID, ...data })
      // 登录接口加客户端标识
      MessageID === '10001' && (data.ClientAppID = ClientAppID)
      // 业务数据压缩
      const jsonStr = JSON.stringify({ ...commonParams, MessageID, ...data })
      // 业务包
      const contBuffer = stringify({
        sessid, data: jsonStr, datalen: jsonStr.length
      }, 'base')
      // 压缩加密
      const buffer = hex2buffer(aesEn(buffer2hex(Pako.deflate(new Uint8Array(contBuffer)))))
      // 返回结果
      return new Promise((resolve, reject) => {
        // 发送
        _requestInterceptors({ messageID: MessageID - 0, buffer, onSuccess: resolve, onError: reject, reqConf })
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

export const tradeReq = new TradeReq()
