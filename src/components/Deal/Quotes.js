import React, { PureComponent } from 'react';
import { View, Platform, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native'
import { getColors } from '../../style'
import { rpx } from 'emrn-common/utils'
import http from '../../apis'
import { qtSSE } from '../../utils/SSE'
import { AppearFunc, logError } from '../../utils/tools'
import { accDiv, accSub } from '../../utils/calculate'
import { getGlobalData } from '../../conf/tools'

// 合约搜索
class Quotes extends PureComponent {
  constructor(props) {
    super(props)
    // 声明
    const { appWillDisappear, appWillAppear } = this
    // APPid
    const appIdx = getGlobalData('appIdx')
    // 创建
    Object.assign(this, {
      // 初始化
      eventSource: qtSSE,
      // 建立监听
      clearLis: AppearFunc(appWillDisappear, appWillAppear),
      // 界面id
      appIdx,
      // sse重连定时器
      timer: 0,
      // 限流
      msgTime: 0,
      // 行情接口
      hqApi: http.getApi('hqList'),
      // 样式
      styles: getCss(),
      // 表格
      cols: [
        { label: '涨停', key1: 'zt', key2: 'ztPerc' },
        { label: '卖价', key1: 'mcj', key2: 'mcl' },
        { label: '最新', key1: 'p', key2: 'vol' },
        { label: '买价', key1: 'mrj', key2: 'mrl' },
        { label: '跌停', key1: 'dt', key2: 'dtPerc' }
      ]
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 声明
    const { uid: nid, quotes: nQuotes } = nextProps
    const { uid: oid, quotes: oQuotes } = this.props
    // 声明
    const { clearQuotes, getQuotes, seeInit } = this
    // console.log(`oid:${oid},nid:${nid}`)
    // 清理
    if (oid && nid === '') {
      clearQuotes()
      // 更新
    } else if (nid !== oid) {
      // 获取行情
      (!nQuotes || nQuotes === oQuotes) && getQuotes(nid)
      // 建立动态连接
      seeInit(nid)
    }
  }

  componentWillUnmount() {
    // console.log('-----------------quotes_Unmount-------------')
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
    // 非同一界面
    if (appIdx !== getGlobalData('appIdx')) return
    // 移除定时器
    timer && clearTimeout(timer)
    // 清理
    clearSSE()
  }

  // 获取静态行情
  getQuotes = async n_uid => {
    // console.log('------------------getQuotes --------------')
    // 声明
    const { props: { uid, setOrder }, hqApi } = this
    // 品种
    const url = `${hqApi}/static/${n_uid || uid}_qt`
    // console.log(url)
    try {
      // console.log('-----------------qt---')
      // 行情数据
      const { qt } = await http.get(url, undefined, { disPending: true }, undefined, true) || {};
      // console.log('-----------------qt---------------------')
      // console.log(qt)
      // console.log(qt && this.props.uid)
      // 格式化
      qt && this.props.uid && setOrder({ quotes: qt })
    } catch (e) {
      logError('quotes.static', e)
    }
  }

  // 动态连接
  seeInit = uid => {
    // 声明
    const { hqApi, getQuotes, onMessage, clearSSE } = this
    // 断开
    clearSSE()
    // 品种
    const id = uid || this.props.uid
    // 无
    if (!id) return
    // logError('Quotes.seeInit', id, 'info')
    // console.log(`${hqApi}/sse/${uid}_qt?field=p,mrj,mcj,zt,dt,zrspj`)
    // 创建SSE
    this.eventSource.init({
      // 路径
      url: `${hqApi}/sse/${id}_qt?field=p,mrj,mcj,zt,dt,zrspj`,
      // 静态请求
      // getStaticData: getQuotes,
      // 监听
      onMsg: onMessage,
    })
  }

  // 接受消息
  onMessage = event => {
    // 声明
    const { props: { uid, setOrder }, msgLimit } = this
    // 限流
    if (msgLimit()) return
    try {
      const { qt = {} } = JSON.parse(event.data) || {}
      // console.log('-----------------qtSSE---------')
      // console.log(qt)
      // 空
      if (!Object.keys(qt).length || !uid) return
      // 格式化
      setOrder({ quotes: qt })
    } catch (e) {
      logError('quotes.onMsg', e)
    }
  }

  // 断开连接
  clearSSE = _ => {
    // 关闭
    this.eventSource && this.eventSource.close()
  }

  clearQuotes = _ => {
    // 关闭
    this.clearSSE()
    // 置空
    this.props.setOrder({ quotes: undefined })
  }

  handleChangePrice = key => _ => {
    // 声明
    const { quotes, setOrderPrice } = this.props
    // 空
    if (!quotes) return
    // 值
    const { [key]: val } = quotes
    // 更新价格
    setOrderPrice({
      val: `${!val || val === '-' ? 0 : val}`,
      type: 0
    })
  }

  // 行情格式化
  fmtQuotes = data => {
    // 数据
    if (!data) return {}
    // 格式化
    const { zt = 0, dt = 0, zjsj = 0 } = data
    // 涨跌停幅
    const ztPerc = Math.round(accSub(accDiv(zt, zjsj), 1) * 100)
    const dtPerc = Math.round(accSub(1, accDiv(dt, zjsj)) * 100)
    // console.log(data)
    // 结果
    return {
      ...data,
      ztPerc: isNaN(ztPerc) ? '--' : `${ztPerc}%`,
      dtPerc: isNaN(dtPerc) ? '--' : `${dtPerc}%`
    }
  }

  msgLimit = _ => {
    // 上次时间
    const { msgTime } = this
    // 当前时间
    const dt = new Date().getTime()
    // 间隔
    const flg = dt - msgTime < 1000
    // 更新
    !flg && (this.msgTime = dt)
    // 间隔
    return flg
  }

  render() {
    // 声明
    const { props: { quotes, uid }, cols, styles, handleChangePrice, fmtQuotes } = this
    // console.log('-------------quotes--------------------')
    // console.log(quotes)
    // 样式
    const { wrap, tr, labelStyle, right, valStyle, z, d, ar } = styles
    // 行情
    const quotesData = uid ? fmtQuotes(quotes) : {}
    // 渲染
    return <View style={wrap}>
      {
        cols.map((col, idx) => {
          // 声明
          const { label, key1, key2 } = col
          // 行样式
          const trStyle = [valStyle, !idx ? z : idx === cols.length - 1 ? d : null]
          // 数据
          const { zsjd, [key1]: val1, [key2]: val2 } = quotesData
          // 渲染
          return <TouchableWithoutFeedback key={key1} onPress={handleChangePrice(key1)}>
            <View style={tr}>
              <Text style={labelStyle}>{label}</Text>
              <View style={right}>
                <Text style={trStyle}>{typeof val1 === 'number' ? val1.toFixed(zsjd) : '--'}</Text>
                <Text style={[trStyle, ar]}>{val2 && val2 !== '-' ? val2 : '--'}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        })
      }
    </View>
  }
}

// export default Throttle(Quotes)
export default Quotes


const getCss = _ => {
  // 当前皮肤
  const { quotesBorder, txt, z, d } = getColors('txt,quotesBorder,z,d')

  return StyleSheet.create({
    wrap: {
      borderRadius: rpx(4),
      borderWidth: rpx(1),
      borderColor: quotesBorder,
      justifyContent: 'space-around',
      width: rpx(290),
      height: rpx(269),
    },
    tr: {
      padding: rpx(12),
      flexDirection: 'row',
    },
    right: {
      flex: 1,
      paddingLeft: rpx(10),
      flexDirection: 'row',
      // justifyContent: 'center'
      justifyContent: 'space-between'
    },
    labelStyle: {
      fontSize: rpx(24),
      color: txt
    },
    valStyle: {
      flex: 1,
      fontSize: rpx(24),
      color: txt,
    },
    z: {
      color: z
    },
    d: {
      color: d
    },
    ar: {
      textAlign: 'right'
    }
  })
}
