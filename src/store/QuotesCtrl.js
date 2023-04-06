import http from '../apis'
import SSE from '../utils/SSE'
import { logError, val2Perc } from '../utils/tools'
import { isNeedCalcDingshi, isQhOptions } from '../utils/Futures'
import { accDiv, accMul, accAdd, accSub } from '../utils/calculate'

class QuotesCtrl {

  constructor() {
    // 创建
    Object.assign(this, {
      // 集合
      TOTAL_KEYS: ['_usePosition', '_useMargin', 'pl', 'dsfy', 'Position', 'mVal', 'dsfy'],
      // 初始化
      eventSource: new SSE(),
      // sse重连定时器
      timer: 0,
      // 静态接口
      staticUrl: '',
      // 长链接口
      sseUrl: '',
      // 行情接口
      hqApi: '',
      // 方法
      props: {},
      // 行情数据
      hqList: [],
      // 持仓
      Positions: [],
      // 资金
      Funds: {},
      // 成交单
      Deals: [],
      // 格式化后持仓
      PositionsDIY: [],
      // 格式化后资金
      FundsDIY: {}
    })
  }

  // 初始化
  init = _ => {
    // 合并
    Object.assign(this, {
      // 接口地址
      hqApi: http.getApi('hqList')
    })
    // 链式
    return this
  }

  // 刷新数据
  refresh = nOpt => {
    // 声明
    const { resetUrl, getQuotes, seeInit, Positions: op, Funds: of } = this
    // 更新
    if (nOpt && typeof nOpt === 'object') {
      // 导入
      const { Positions = op, Funds = of } = nOpt
      // 更新
      Object.assign(this, { Positions, Funds })
    }
    // 链接
    resetUrl()
    // 静态数据
    getQuotes()
    // 建立链接
    seeInit()
  }

  // 获取静态行情
  getQuotes = async _ => {
    // 声明
    const { staticUrl, updFunc } = this
    try {
      // console.log(staticUrl)
      // 行情数据
      const { list = [] } = staticUrl ? await http.get(staticUrl, {
        orderBy: 'zdf', sort: 'asc', pageSize: 999, pageIndex: 0
      }) || {} : {}
      // console.log('------------------listq-------------')
      // console.log(list)
      // 更新行情数据
      this.hqList = list
      // 合并
      updFunc()
    } catch (e) {
      // 提醒
      // Toast.show({ gravity: 'center', text: '网络错误，请稍后重试！' })
      // 日志
      logError('QuotesReq.static', e)
    }
  }

  // 动态连接
  seeInit = _ => {
    // 声明
    const { getQuotes, clearSSE, onMessage, sseUrl } = this
    // 清理
    clearSSE()
    // 无需SSE
    if (!sseUrl) return
    // console.log(sseUrl)
    // logError('ReqFunc.seeInit', sseUrl, 'info')
    // return
    // 创建SSE
    this.eventSource.init({
      // 路径
      url: `${sseUrl}?field=dm,p,mcj,mrj`,
      // 静态请求
      // getStaticData: getQuotes,
      // 监听
      onMsg: onMessage,
    })
  }

  // 推送回调
  onMessage = event => {
    // 声明
    const { hqList = [], updFunc } = this
    try {
      const { qtList = [] } = JSON.parse(event.data)
      // 空
      if (!qtList.length) return
      // console.log(JSON.parse(event.data))
      // 更新行情数据
      // this.hqList = hqList.filter(hq => qtList.every(qt => hq.dm !== qt.dm)).concat(qtList)
      this.hqList = hqList.map(o => Object.assign({}, o, qtList.find(qt => o.dm === qt.dm)))
      // 更新
      updFunc()
    } catch (e) {
      // 日志
      logError('QuotesReq.onMsg', e)
    }
  }

  // 更新
  updFunc = _ => {
    // 声明
    const { calcPos, calcFunds, _setStore } = this
    // console.log('updFunc')
    // 持仓
    const PositionsDIY = calcPos()
    // 资金
    const FundsDIY = calcFunds()
    // console.log(FundsDIY)
    // 更新全局
    typeof _setStore === 'function' && _setStore({
      Positions: PositionsDIY,
      Funds: FundsDIY
    })
  }

  // 关闭连接
  clearSSE = _ => {
    this.eventSource && this.eventSource.close()
  }

  // 接口地址
  resetUrl = _ => {
    // 声明
    const { hqApi, Positions } = this
    // id
    const uids = Positions.reduce((str, { _uid }) => {
      const ids = str.split(',')
      if (_uid && !ids.find(i => i === _uid)) {
        str ? ids.push(_uid) : ids.splice(0, 1, _uid)
      }
      return ids.join(',')
    }, '')
    // 品种
    Object.assign(this, !uids ? {
      staticUrl: '', sseUrl: ''
    } : {
      staticUrl: `${hqApi}/list/custom/${uids}`,
      sseUrl: `${hqApi}/sse/custom/${uids}`,
    })
  }

  // 合并持仓行情
  calcPos = _ => {
    // 声明
    const { Positions, hqList } = this
    // 遍历
    const PositionsDIY = Positions.map(item => {
      // 声明
      const { ProductID, ProductClass, EMInstumentID, InstrumentID, Position = 0, OpenCost = 0, VolumeMultiple = 0, SettlementPrice = 0, _longFlg, optionsType } = item || {}
      // 过滤期权
      if (optionsType) return item
      // 遍历
      const n = hqList.find(({ dm }) => dm === EMInstumentID || dm === InstrumentID) || item
      // 默认为0
      let price = 0
      // 有行情时
      if (n) {
        // 声明
        const { p, zjsj, pclose } = n || {}
        // 最新价 -20210308兼容无现价情况
        // price = p === '-' ? !zjsj || zjsj === '-' ? 0 : zjsj : p
        price = p && p !== '-' ? p : zjsj && zjsj !== '-' ? zjsj : pclose && pclose !== '-' ? pclose : 0
        // 非盯市时间使用ctp结算价
        if (price === 0 || !isNeedCalcDingshi(ProductID, isQhOptions(ProductClass))) {
          price = SettlementPrice
        }
      }
      // 市值
      const mVal = accMul(price, Position * VolumeMultiple)
      // 总盈亏计算 -20210308兼容保留整数
      const pl = price ? accMul(accSub(mVal, OpenCost), (_longFlg ? 1 : -1)).toFixed(0) : 0
      // 结果
      return { ...item, _longFlg, mVal, pl, ...n, price }
    })
    // 更新
    this.PositionsDIY = PositionsDIY
    // 结果
    return PositionsDIY
  }

  // 资金计算
  calcFunds = _ => {
    // 声明
    const { Funds, Deals, PositionsDIY, TOTAL_KEYS, _sum } = this
    // 初始化
    // TOTAL_KEYS.map(key => total[`${key}Total`] = 0)
    // console.log(PositionsDIY)
    // 合并
    const total = PositionsDIY.reduce((total, item) => {
      // 声明
      const {
        InstrumentID, Position = 0, PosiDirection, PositionCost, optionsType,
        VolumeMultiple = 0, _longFlg, ExchangeID, price, PreSettlementPrice = 0, PositionCostOffset = 0
      } = item || {}
      // 过滤期权
      if (optionsType) return { ...total, hasOptions: true }
      // 成本
      let positionCost = PositionCost
      // 乘数
      const posVol = accMul(Position, VolumeMultiple)
      // 大商所
      if ((ExchangeID === 'DCE' || ExchangeID === 'GFEX') && Deals.find(deal => {
        // 声明
        const { InstrumentID: id, Direction, offsetFlag } = deal
        // 返回
        return id === InstrumentID && Direction + PosiDirection === 99 && offsetFlag
      })) {
        positionCost = PositionCost - PositionCostOffset
        // // 昨结成本
        // positionCost = accMul(posVol, PreSettlementPrice)
        // // 持仓数
        // let position = Position
        // // 遍历
        // Deals.forEach(deal => {
        //   // 声明
        //   const { Volume = 0, InstrumentID: id, Direction, Price, offsetFlag } = deal
        //   // 返回
        //   if (id !== InstrumentID || Direction !== PosiDirection - 2 || offsetFlag || position <= 0) return
        //   // 计算数量
        //   const vol = accMul(Math.min(position, Volume), VolumeMultiple)
        //   // 昨日成本
        //   positionCost -= accMul(vol, PreSettlementPrice)
        //   // 今日盈利
        //   positionCost += accMul(vol, Price)
        //   // 数量
        //   position = accSub(position, Volume)
        // })
      }
      // 盯市
      item.dsfy = accMul(accSub(accMul(price, posVol), positionCost), (_longFlg ? 1 : -1))
      // 求和
      return _sum(total, item, TOTAL_KEYS)
    }, {})
    // console.log(total)
    // 声明
    const { dsfyTotal = 0, mValTotal = 0 } = total
    // 更新权益
    const { Balance = 0, PositionProfit = 0, CurrMargin = 0, CloseProfit = 0, FrozenMargin = 0 } = Funds || {}
    // 当前权益
    const dqqy = accSub(accAdd(Balance, dsfyTotal), PositionProfit)
    // 更新
    const FundsDIY = {
      ...Funds, ...total, dqqy,
      // 盯市浮盈
      dsfyTotal: dsfyTotal.toFixed(0),
      // 杠杆率
      ggl: accDiv(mValTotal || 0, CurrMargin),
      // 使用率
      usePerc: val2Perc(accAdd(CurrMargin, FrozenMargin), dqqy),
      // 平仓盈亏率
      CloseProfitPerc: val2Perc(CloseProfit, dqqy),
      // 盯市浮盈率
      dsfyTotalPerc: val2Perc(dsfyTotal, dqqy)
    }
    // 更新
    this.FundsDIY = FundsDIY
    // 结果
    return FundsDIY
  }

  // 合计
  _sum = (base, data, keys) => keys.reduce((total, key) => {
    const totalKey = `${key}Total`
    const { [totalKey]: bVal = 0 } = base
    const { [key]: val = 0 } = data
    // 转数字
    const nv = Number(val)
    // 遍历
    total[totalKey] = accAdd(!val || isNaN(nv) ? 0 : val, bVal)
    // 返回
    return total
  }, { ...base })

  setProps = props => Object.assign(this, props)
}

export default new QuotesCtrl()
