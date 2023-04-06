// 持仓列表
import { SET_POS_ITEM, SET_POS_LIST, SET_STORE } from '../actions/Types'
import { transUid } from '../../utils/Futures'
import { accSub, accDiv, accAdd } from '../../utils/calculate'

export const Positions = (state = [], action) => {
  const { type, list, Positions } = action
  switch (type) {
    case SET_STORE:
      return Positions || state
    // 初始化
    case SET_POS_LIST:
      // 更新
      return list || []
    // 更新用户信息
    case SET_POS_ITEM:
      return list || []
    // 更新
    // return updList(state, id, info)
    default:
      return state
  }
}

// 持仓单格式化
export const fmtOfPosi = item => {
  // 声明
  const { InstrumentID, PosiDirection, OpenCost, VolumeMultiple, Position, ShortFrozen, LongFrozen, UseMargin, CombPosition, OptionsType } = item
  // 期权
  if (OptionsType === 50 || OptionsType === 49) return { InstrumentID, optionsType: 1 }
  // 过滤
  if (!VolumeMultiple || !Position) return false
  // 持仓方向
  const _posiDirection = Number(String.fromCharCode(PosiDirection))
  // 开仓价=开仓成本OpenCost/手数Position/合约乘数
  const _cost = accDiv(accDiv(OpenCost, Position), VolumeMultiple)
  // 是否是多头
  const _longFlg = _posiDirection === 2
  // 返回
  return {
    ...item, _posiDirection, _longFlg, _cost,
    id: `${InstrumentID}_${PosiDirection}`,
    // 行情id
    _uid: transUid(item),
    // 可用=持仓手数-空头/多头冻结
    _usePosition: accSub(Position, (_longFlg ? ShortFrozen : LongFrozen)),
    _useMargin: !CombPosition ? UseMargin.toFixed(1) : '--',
    _useMarginNum: UseMargin ? UseMargin.toFixed(1) : '--'
  }
}

// 需要合并的字段
const needMergeKeys = [
  'YdPosition', 'Position', 'LongFrozen', 'LongFrozenAmount', 'ShortFrozenAmount', 'OpenVolume', 'CloseVolume',
  'OpenAmount', 'CloseAmount', 'PositionCost', 'PreMargin', 'FrozenMargin', 'FrozenCash', 'FrozenCommission', 'CashIn', 'AbandonFrozen',
  'Commission', 'CloseProfit', 'PositionProfit', 'OpenCost', 'ExchangeMargin', 'UseMargin', 'CombPosition', 'CombLongFrozen',
  'CombShortFrozen', 'CloseProfitByDate', 'CloseProfitByTrade', 'TodayPosition', 'StrikeFrozen', 'StrikeFrozenAmount', 'ShortFrozen'
]
// 合并昨今仓
export const mergePosiItem = list => {
  // 暂存
  const temp = {}
  // 过滤掉无需合并的合约
  const l1 = list.filter(item => {
    // 声明
    const { InstrumentID, PosiDirection, ExchangeID, Position } = item
    // 过滤掉已平单据
    if (!Position) return false
    // 非上期所||上期能源，无需合并
    if (ExchangeID !== 'SHFE' && ExchangeID !== 'INE') return true
    // 标识
    const key = `${InstrumentID}_${PosiDirection}`
    // 缓存
    const { [key]: list } = temp
    // 无则添加
    list ? list.push(item) : (temp[key] = [item])
  })
  // 合并
  const l2 = Object.keys(temp).map(key => {
    // 声明
    const ar = temp[key]
    // 初始
    const i = { ...ar[0] }
    // 持仓方向
    const { PosiDirection } = i
    // 单条无需计算
    // if (ar.length === 1) return i
    // 累加
    const sumRes = ar.reduce((total, cur) => {
      // 声明
      let { longTodayFrozen = 0, ShortTodayFrozen = 0 } = total
      const { PositionDate, LongFrozen, ShortFrozen } = cur
      // 今日冻结
      if (PositionDate === 49) {
        longTodayFrozen += LongFrozen
        ShortTodayFrozen += ShortFrozen
      }
      // 合并
      needMergeKeys.forEach(key => {
        const { [key]: oVal = 0 } = total
        // 累加
        total[key] = accAdd(oVal, cur[key])
      })
      // 返回
      return {
        ...total,
        longTodayFrozen, ShortTodayFrozen
      }
    }, {})
    // 今日可用
    const { TodayPosition, longTodayFrozen, ShortTodayFrozen } = sumRes
    // 合并
    return {
      ...i, ...sumRes,
      // 今日可用
      _holdNumber: TodayPosition - (PosiDirection === 50 ? ShortTodayFrozen : longTodayFrozen)
    }
  })
  return [].concat(l1, l2)
}
