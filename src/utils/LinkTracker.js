'use strict'
import http from '../apis'
import { logError } from './tools'
import { Passport } from 'emrn-common/utils/hybrid'

class LinkTracker {

  constructor() {
    // 初始化
    Object.assign(this, {
      // 配置
      options: {},
      // 埋点数据
      list: [],
      // 公共参数
      commonParams: {},
      // 最大
      max: 50
    })
  }

  add = info => {
    // 声明
    const { list, submit, max } = this
    const { LogEvent, logEvent } = info
    // 兼容
    const logId = LogEvent || logEvent
    // 无埋点
    if (!logId) return
    // 新增
    list.push(logId)
    // 提交
    list.length >= max && submit()
  }

  // 提交
  submit = async _ => {
    // 声明
    const { list, commonParams } = this
    // 取消发送
    if (!list.length) return
    // 格式化
    const fmtList = list.map(i => ({ button: i, ...commonParams }))
    // 请求
    await http.request('futuresTrack', fmtList).catch(e => logError('TrackerError', e))
    // 重置
    this.list = []
  }

  // 公共参数
  initCommonParams = options => {
    // 声明
    const {
      Device: { model, uniqueId, osv, euid, platform, imei },
      AppInfo: { appVersionCode, appVersionName, channel, appType }
    } = options
    // 更新公共参数
    this.commonParams = {
      deviceId: uniqueId,
      euid,
      appVersion: appVersionName,
      versionCode: appVersionCode,
      platform,
      platFormVersion: osv,
      device: model,
      deviceVersion: osv,
      channelId: channel,
      iphoneToken: imei,
      account: '',
      uuid: '',
      did: '',
      appType
    }
    // 通行证
    Passport.getUserInfo().then(res => {
      const { info: { uid } = {} } = res
      this.commonParams.uuid = uid
    })
  }
}

export default new LinkTracker()
