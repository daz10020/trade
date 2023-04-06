import React, { PureComponent } from 'react'
import http from '../../apis'
// import { posiSSE } from '../../utils/SSE'
import { val2Perc, logError, AppearFunc } from '../../utils/tools'
import { isNeedCalcDingshi, isQhOptions } from '../../utils/Futures'
import { accDiv, accMul, accAdd, accSub } from '../../utils/calculate'
import { getGlobalData } from '../../conf/tools'


const hqKeys = ['qrspj', 'spsj', 'np', 'rz', 'dm', 'zsjd', 'lx', 'ccl', 'ly', 'kpsj', 'dt', 'sc', 'uid', 'vol', 'bpgs', 'jysj', 'mcj', 'cjbs', 'mcl', 'wp', 'cje', 'mrj', 'utime', 'jjsj', 'mrl', 'h', 'j', 'zccl', 'l', 'zf', 'mmpl', 'o', 'p', 'cclbh', 'xsfx', 'lb', 'name', 'zde', 'zt', 'jyzt', 'xs', 'spgs', 'zdf', 'mmpjg', 'zjsj']
export default Element => class extends PureComponent {
  constructor(props) {
    super(props)
    // 声明
    const { appWillDisappear, appWillAppear } = this
    // APPid
    const appIdx = getGlobalData('appIdx')
    // 创建
    Object.assign(this, {
      // 集合
      TOTAL_KEYS: ['_usePosition', '_useMargin', 'pl', 'dsfy', 'Position', 'mVal'],
      // 初始化
      // eventSource: posiSSE,
      // 建立监听
      clearLis: AppearFunc(appWillDisappear, appWillAppear),
      // 界面id
      appIdx,
      // sse重连定时器
      timer: 0,
      // 接口
      staticUrl: '',
      sseUrl: '',
      // 行情接口
      hqApi: http.getApi('hqList'),
      // 行情数据
      hqList: [],
      // 状态
      state: {
        PositionsDIY: [],
        Funds: {}
      },
    })
  }

  componentDidMount() {
    // 声明
    const { getQuotes, resetUrl, seeInit, props: { Positions } } = this
    // 无
    // if (!Positions.length) return
    // 初始化
    resetUrl()
    // 获取行情
    getQuotes()
    // 建立动态连接
    seeInit()
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 声明
    const { Positions: np, Positions: { length: npLen }, Funds: nF } = nextProps
    const { clearSSE, getQuotes, seeInit, resetUrl, props: { Positions: op, Positions: { length: opLen }, Funds: oF } } = this
    // 未改变
    if (op === np && nF === oF) return
    // 清理
    if (opLen && !npLen) {
      // 停止
      return clearSSE()
    } else if (!opLen && npLen) {
      // 从无到有
      this.setState({ PositionsDIY: np.filter(({ InvestorID }) => InvestorID) })
    }
    // 有变化
    if (npLen !== opLen || !np.every(n => op.some(o => n.InstrumentID === o.InstrumentID))) {
      // 先更新接口
      resetUrl(np)
      // 建立动态连接
      seeInit()
    }
    // 获取行情
    getQuotes(nextProps)
  }

  componentWillUnmount() {
    this.clearSSE()
  }


  componentWillUnmount() {
    // 声明
    const { timer, clearSSE, clearLis } = this
    // 销毁监听
    clearLis()
    // 移除定时器
    timer && clearTimeout(timer)
    // 断开链接
    clearSSE()
  }

  appWillAppear = _ => {
    // logError('_controllerWillAppear', this.appIdx, 'info')
    // 声明
    const { appIdx, seeInit, timer } = this
    // console.log('appWillAppear')
    // console.log(appIdx !== getGlobalData('appIdx'))
    // 非同一界面
    if (appIdx !== getGlobalData('appIdx')) return
    // 移除定时器
    timer && clearTimeout(timer)
    // 延时
    this.timer = setTimeout(_ => {
      // 持仓
      seeInit()
    }, 1000)
  }

  appWillDisappear = _ => {
    // logError('_controllerWillDisappear', this.appIdx, 'info')
    // 声明
    const { appIdx, clearSSE, timer } = this
    // console.log('appWillDisappear')
    // console.log(appIdx !== getGlobalData('appIdx'))
    // 非同一界面
    if (appIdx !== getGlobalData('appIdx')) return
    // 移除定时器
    timer && clearTimeout(timer)
    // 清理
    clearSSE()
  }

  // 获取静态行情
  getQuotes = async nextProps => {
    //   // 更新行情数据
    //   this.hqList = list
    //   // 合并
    this._mergeList(nextProps)
    // 声明
    // const { staticUrl, _mergeList } = this
    // try {
    //   // console.log(staticUrl)
    //   // 行情数据
    //   const { list = [] } = staticUrl ? await http.get(staticUrl, {
    //     orderBy: 'zdf', sort: 'asc', pageSize: 999, pageIndex: 0
    //   }) || {} : {}
    //   // console.log('------------------listq-------------')
    //   // console.log(list)
    //   // 更新行情数据
    //   this.hqList = list
    //   // 合并
    //   _mergeList(nextProps)
    // } catch (e) {
    //   // 提醒
    //   Toast.show({ gravity: 'center', text: '网络错误，请稍后重试！' })
    //   // 日志
    //   logError('QuotesReq.static', e)
    // }
  }

  // 动态连接
  seeInit = _ => {
    // 声明
    const { getQuotes, clearSSE, onMessage, sseUrl, props: { disSSE } } = this
    // 清理
    clearSSE()
    // 无需SSE
    if (disSSE || !sseUrl) return
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
    const { hqList = [], props: { Positions = [] }, _mergeList } = this
    try {
      const { qtList = [] } = JSON.parse(event.data)
      // 空
      if (!qtList.length) return
      // console.log(JSON.parse(event.data))
      if (hqList.length) {
        // 更新行情数据
        this.hqList = hqList.map(o => Object.assign({}, o, qtList.find(qt => o.dm === qt.dm)))
      } else {
        this.hqList = Positions.reduce((list, o) => {
          list.every(n => n.dm !== o.dm) && list.push(Object.assign(hqKeys.reduce((obj, key) => {
            obj[key] = o[key]
            return obj
          }, {}), qtList.find(qt => o.dm === qt.dm)))
          return list
        }, [])
      }
      // 格式化
      _mergeList()
    } catch (e) {
      // 日志
      logError('QuotesReq.onMsg', e)
    }
  }
  // 关闭连接
  clearSSE = _ => {
    this.eventSource && this.eventSource.close()
  }

  // 接口地址
  resetUrl = np => {
    const { hqApi } = this
    // 声明
    const pos = np || this.props.Positions
    // id
    const uids = Array.from(new Set(pos.map(({ _uid }) => _uid))).join(',')
    // 品种
    Object.assign(this, !uids ? {
      staticUrl: '', sseUrl: ''
    } : {
      staticUrl: `${hqApi}/list/custom/${uids}`,
      sseUrl: `${hqApi}/sse/custom/${uids}`,
    })
  }

  // 合并
  _mergeList = nextProps => {
    // 声明
    const { props, hqList = [], _sum, _dsfy, TOTAL_KEYS } = this
    const { Positions, Funds } = nextProps || props || {}
    // 数组
    const nList = []
    // this.hqList = Positions
    // 初始化
    // TOTAL_KEYS.map(key => total[`${key}Total`] = 0)
    // console.log(Positions)
    // 合并
    const total = Positions.reduce((total, item) => {
      // 声明
      const { ProductID, ProductClass, InstumentID, EMInstumentID, Position = 0, OpenCost = 0, VolumeMultiple = 0, SettlementPrice = 0, _longFlg, optionsType } = item || {}
      // 过滤期权
      if (optionsType) return { ...total, hasOptions: true }
      // 遍历
      // const n = hqList.find(item => item.dm === EMInstumentID)
      const n = hqList.find(({ dm }) => dm === EMInstumentID || dm === InstumentID) || item
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
      const res = { ...item, _longFlg, mVal, pl, ...n, price }
      // 格式化
      nList.push(res)
      // 求和
      return _sum(total, res, TOTAL_KEYS)
    }, {})
    // 盯市浮盈
    const dsfyTotal = _dsfy(nList)
    // 更新权益
    const { Balance = 0, PositionProfit = 0, CurrMargin = 0, CloseProfit = 0, FrozenMargin = 0 } = Funds || {}
    // 当前权益
    const dqqy = accSub(accAdd(Balance, dsfyTotal), PositionProfit)
    // 更新
    this.setState({
      PositionsDIY: nList,
      Funds: {
        ...total, ...Funds, dqqy, dsfyTotal: dsfyTotal.toFixed(0),
        // 杠杆率
        ggl: accDiv(total.mValTotal || 0, CurrMargin),
        // 使用率
        usePerc: val2Perc(accAdd(CurrMargin, FrozenMargin), dqqy),
        // 平仓盈亏率
        CloseProfitPerc: val2Perc(CloseProfit, dqqy),
        // 盯市浮盈率
        dsfyTotalPerc: val2Perc(dsfyTotal, dqqy)
      }
    })
  }

  // 合计
  _sum = (base, data, keys) => keys.reduce((total, key) => {
    const totalKey = `${key}Total`
    const { [totalKey]: bVal = 0 } = base
    const { [key]: val = 0 } = data
    // 遍历
    total[totalKey] = accAdd(isNaN(Number(val)) ? 0 : val, bVal)
    // 返回
    return total
  }, { ...base })

  // 盯市浮盈
  _dsfy = list => {
    // 成交单
    const { Deal } = this.props
    // 汇总
    return list.reduce((total, cur) => {
      // 声明
      const {
        InstrumentID, Position = 0, PosiDirection, PositionCost, OptionsType,
        VolumeMultiple = 0, _longFlg, ExchangeID, price, PreSettlementPrice = 0,
      } = cur
      // 过滤期权
      if (OptionsType === 50 || OptionsType === 49) return total
      // 成本
      let positionCost = PositionCost
      // 乘数
      const posVol = accMul(Position, VolumeMultiple)
      // 大商所
      if (ExchangeID === '0') {
        // 昨结成本
        positionCost = accMul(posVol, PreSettlementPrice)
        // 持仓数
        let position = Position
        // 遍历
        Deal.forEach(deal => {
          // 声明
          const { Volume = 0, InstrumentID: id, Direction, Price, combOffsetFlag } = deal
          // 返回
          if (id !== InstrumentID || Direction !== PosiDirection - 2 || combOffsetFlag) return
          // 计算数量
          const vol = accMul(Math.min(position, Volume), VolumeMultiple)
          // 昨日成本
          positionCost -= accMul(vol, PreSettlementPrice)
          // 今日盈利
          positionCost += accMul(vol, Price)
          // 数量
          position = accSub(position, Volume)
        })
      }
      // 盯市
      const dsfy = accMul(accSub(accMul(price, posVol), positionCost), (_longFlg ? 1 : -1))
      // 计算
      return accAdd(total, (isNaN(dsfy) ? 0 : dsfy))
    }, 0)
  }

  // _refresh = _ => {
  //   // 声明
  //   const { props: { getPositions }, seeInit } = this
  //   // 获取持仓
  //   getPositions()
  //   // 建立动态连接
  //   seeInit()
  // }

  render() {

    const { state, props: { Funds, ...passThroughProps }, getQuotes } = this
    // console.log('-----------------QuotesRequest Render---------------')
    // console.log(this.props)

    return <Element {...passThroughProps} {...state} getQuotes={getQuotes}/>
  }
}
