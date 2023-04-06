'use strict'

// 夜盘配置格式
const NIGHT_CODES_TYPE = {
  market: Number,
  name: String,
  code: String,
  type: Number
}
// APP配置
export const futuresApp = {
  nightCodes: {
    size: Number,
    datas: {
      type: Array,
      children: NIGHT_CODES_TYPE
    }
  },
  socketConfig: {
    wsUrl: String,
    brokerId: String
  }
}
