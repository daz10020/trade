import axios from 'axios/index'
import { Logger } from 'emrn-common/utils/hybrid'
import { getGlobalData } from '../conf/tools';

// queryString
// const qs = require('qs')

// 修改全局默认值
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

const { isCancel, CancelToken } = axios

export default class Request {
  constructor(options) {
    this.apis = null
    this.service = {}
    this.options = options
    // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
    this.pending = []
    // 初始化路径
    this.env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
    // 初始化
    this.reqInit(options)
  }

  removePending = ever => {
    this.pending = this.pending.filter(p => {
      const { url, cancelMsg } = ever
      // 当当前请求在数组中存在时执行函数体
      if (p.u === url) {
        // 执行取消操作
        p.f(cancelMsg)
        // 把这条记录从数组中移除
        return false
      }
      return true
    })
  }

  errorLog = error => {
    // console.log(error)
    const { response: { data = {} } = {}, config = {} } = error
    // 保存日志
    Logger.error({
      tag: 'FuturesTrade.RequestError',
      error: `${JSON.stringify({
        response: data,
        config,
        error: error.toString()
      })}`
    })
  }

  reqInit = options => {
    // 获取配置
    const { sucCodeKey = 'code', apis = {} } = options
    // 初始化请求实例
    const service = axios.create({
      // baseURL: "",
      timeout: 10000, // 请求超时时间
      withCredentials: true,
      ...options
    })

    // request拦截器
    service.interceptors.request.use(config => {
      try {
        // 获取配置
        const { data, url, params: { axiosConf: { dataFmt, cancelMsg, disPending } } } = config
        // 数据格式化
        // dataFmt && (config.data = qs.stringify(data))
        Logger.info({
          tag: 'FuturesTrade.Request',
          msg: `${JSON.stringify(config)}`
        })
        if (!disPending) {
          // 在一个ajax发送前执行一下取消操作
          this.removePending({ cancelMsg, url })
          // 记录请求
          config.cancelToken = new CancelToken(c => this.pending.push({ u: url, f: c }))
        }
        // console.log(config)
        return config
      } catch (e) {
        // console.log(e)
      }
    }, error => Promise.reject(error))

    // response 拦截器
    service.interceptors.response.use(response => {
      // 获取响应及配置项
      const {
        data, data: { [sucCodeKey]: code, msg },
        config: { params: { axiosConf: { cancelMsg, hideMsg, disPending } }, url }
      } = response
      // console.log(response)
      // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
      !disPending && this.removePending({ cancelMsg, url })
      return data
    }, error => {
      // console.log(error)
      // 取消
      if (isCancel(error)) return
      // 错误日志
      this.errorLog(error)
      // 暴露错误
      return Promise.reject(error)
    })
    // 全局赋值
    this.service = service
  }
  // 初始化接口地址
  initApi = _ => {
    // 声明
    const { options: { apis } } = this
    // 接口地址
    // const { env = 'prop' } = await Container.getEnv()
    const { $react_env = 'prop'} = getGlobalData('StartupParams') || {}
    // 赋值
    const apisConf = apis[$react_env]
    this.apis = apisConf
    return apisConf
  }

  // 请求
  async request(api, data, axiosConf = {}, headers = {}) {
    // 声明
    const { getApi, env } = this
    // api
    let url = /^http/.test(api) ? api : getApi(api)
    // 如果是对象 对应url
    typeof url === 'object' && (url = url[env])
    // 获取请求方式
    const [path, reqType = 'get', dataFmt] = url.split(',')
    // 调用对应方法
    return this[reqType](path, data, { dataFmt, ...axiosConf }, headers, true)
  }

  async get(api, params, axiosConf = {}, headers = {}, flg) {
    try {
      return await this.service({
        url: flg ? api : this.getApi(api),
        params: { ...params, axiosConf },
        headers
      })
    } catch (e) {
      // console.log(e)
    }

  }

  async post(api, data, axiosConf = {}, headers = {}, flg) {
    return await this.service({
      url: flg ? api : this.getApi(api),
      method: 'post',
      data,
      params: { axiosConf },
      headers,
      ...axiosConf
    })
  }

  /*
  * 获取请求接口
  * @Params key
  * @Typeof String
  * */
  getApi = key => {
    // 声明
    const { apis, initApi } = this
    // 没有则加载
    const apisConf = apis || initApi()
    // 全路径
    if(/^http/.test(key)) return key
    // 接口地址
    if (key.indexOf('_') === -1) {
      return apisConf[key]
    } else {
      let api = apisConf
      key.split('_').forEach(k => (api = api[k]))
      return api
    }
  }
}

