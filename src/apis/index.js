import Request from '../utils/request'
import test from './test'
import prod from './prod'
import stage from './stage'
// 地址
export const apis = { test, stage, prod }
// 生成器
export const createRequest = options => new Request({
  apis,
  ...options
})
// 默认请求
export default new Request({ apis })
