import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import SearchInput from './SearchInput'
import NumberInput from './NumberInput'
import PriceBtn from './PriceBtn'
import Quotes from './Quotes'
import Margin from './Margin'
import rpx from 'emrn-common/utils/rpx'
import Buttons from './Buttons'
import { Toast } from 'emrn-common/utils/hybrid'
import { EmAlert } from 'emrn-common/components'
import { accAdd } from '../../utils/calculate'
import { getInstrumentsByIds } from '../../conf/Instrument'
import { getGlobalData } from '../../conf/tools'
import { reqMarginRate } from '../../socket1/apis'

export default class Panel extends PureComponent {
  constructor(props) {
    super(props)
    // ios
    const isIos = Platform.OS === 'ios'
    // const PriceInp = isIos ? NumberInputIOS : NumberInput
    // 创建
    Object.assign(this, {
      // 价格框
      // PriceInp,
      // 持仓变化
      posChangeFlg: false,
      // 搜索框
      searchInp: null,
      // 价格框
      priceInp: null,
      // ios兼容
      zIndex: isIos ? { zIndex: 1 } : null,
      // 状态
      state: {
        ...this.initleState()
      }
    })

  }

  componentDidMount() {
    // 默认参数
    this.setDefaultCode()
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 声明
    const { Positions: nPosi } = nextProps
    const { props: { Positions: oPosi }, posChangeFlg } = this
    // 记录持仓变化
    if (nPosi !== oPosi) {
      this.posChangeFlg = true
    }
    // 待行情数据返回后执行
    if (posChangeFlg) {
      // 声明
      const { code, actPosDirect, baseInfo } = this.state
      // 当前持仓
      const curPosi = nPosi.filter(item => item.InstrumentID === code)
      // 更新
      this.setState({
        curPosi,
        actPosDirect: curPosi.some(item => item._posiDirection === actPosDirect) ? actPosDirect : undefined,
        baseInfo: baseInfo || getInstrumentsByIds(code)
      })
      // 重置
      this.posChangeFlg = false
    }
  }

  initleState = _ => ({
    // code
    code: '',
    // id
    uid: '',
    // 数量
    volume: '',
    // 当前品种持仓
    curPosi: [],
    // 持仓方向
    actPosDirect: undefined,
    // 价格
    price: undefined,
    // 行情
    quotes: undefined,
    // 基本信息
    baseInfo: undefined,
    // 保证金
    marginRatio: undefined
  })

  // 品种代码
  setOrderCode = data => {
    // 声明
    const { code } = data
    const { props: { Positions }, getMargin } = this
    // 填充表单
    this.setState({
      ...data,
      // 获取当前品种对应持仓信息
      curPosi: Positions.filter(item => item.InstrumentID === code),
      // 基本信息
      baseInfo: getInstrumentsByIds(code)
    })
    // 保证金
    getMargin(code)
  }

  // 设置表单
  setOrder = data => {
    // 声明
    const { getMargin } = this
    // 更新
    this.setState(data)
    // 保证金
    try {
      data.code && getMargin(code)
    } catch (e) {
    }
  }

  // 重置
  clearOrder = flg => {
    // 声明
    const { initleState, props: { handleClearPosAct }, searchInp } = this
    // 重置表单
    this.setState(initleState())
    // 清理列表选中状态
    handleClearPosAct()
    // 普通清理
    if (flg) return
    // 清理搜索框
    searchInp._clear()
  }

  setDefaultCode = _ => {
    // 初始变量
    const { futuresCode, marketId } = getGlobalData('StartupParams')
    // 有初始品种
    futuresCode && this.setOrderCode({
      code: futuresCode,
      uid: `${marketId}_${futuresCode}`,
      volume: '1',
      price: { val: '对手价', type: 1 }
    })
  }

  // 报单
  handleButtonClick = async params => {
    // 声明
    const { price, offsetFlg, direction } = params
    // 声明
    const { state: { code, volume, curPosi, quotes, quotes: { zt, dt } = {} }, props: { handleSubmit }, state } = this
    // 无数据
    if (!code) return Toast.show({ gravity: 'center', text: '请选择合约' })
    // 暂无行情
    if (!quotes) return Toast.show({ gravity: 'center', text: '该合约暂无行情' })
    // 价格
    if (!price || price === '--' || price === '-') return Toast.show({ gravity: 'center', text: '请输入价格' })
    // 超出范围
    if (price > zt || price < dt) await new Promise(((resolve, reject) => EmAlert({
      title: '温馨提示',
      message: price > zt ? `委托价格高于涨停价格` : `委托价格低于跌停价格`,
      buttons: ['取消', '确定'],
      onOk: resolve,
      onCancel: reject
    })))
    // 数量
    if (!volume || String(volume) === '0') return Toast.show({ gravity: 'center', text: '请输入数量' })
    // 平仓
    if (offsetFlg) {
      // 无持仓
      if (price === '无持仓') return Toast.show({ gravity: 'center', text: '合约可平数量不足' })
      // 锁仓持仓
      if (price === '锁仓状态') return EmAlert({ title: '温馨提示', message: '请在下方的持仓中选择要平仓的合约，再进行平仓操作。' })
      // 当前持仓
      const { _usePosition = 0 } = curPosi.find(posi => Boolean(posi._posiDirection - 2) === !direction)
      // 可用为0
      if (!_usePosition) return EmAlert({ title: '温馨提示', message: '合约可用手数为0，请先撤单后尝试平仓。' })
      // 持仓不足
      if (_usePosition < volume) return EmAlert({
        title: '温馨提示',
        message: `系统显示目前仅有${_usePosition}手持仓可用，是否按照系统显示的手数发委托？`,
        buttons: ['取消', '确定'],
        onOk: _ => handleSubmit(params, { ...state, volume: _usePosition })
      })
    }
    // 下单
    handleSubmit(params, state)
  }

  // 数量
  handleChangeVolume = n => {
    this.setState({ volume: n })
  }

  // 价格
  setOrderPrice = n => {
    // 未选中合约
    if (!this.state.code) return Toast.show({ gravity: 'center', text: '请先选择合约' })
    // 更新价格
    this.setState({ price: n })
    // // 失焦
    // this.priceInp.handleBlur()
  }

  // 价格
  handleChangePrice = n => {
    // 价格t
    this.setState({ price: { val: `${n}`, type: 0 } })
  }

  // 更新价格参数
  handleClickPriceBtn = (value, tick) => {
    // 声明
    const { code, quotes: { p } = {}, price: { type } = {} } = this.state
    // 未选中合约
    if (type && !code) return
    // 计算
    this.setState({
      price: {
        val: `${accAdd((type ? p === '-' || !p ? 0 : p : value), tick)}`,
        type: 0
      }
    })
  }

  // 保证金
  getMargin = async code => {
    // 获取保证金
    const { LongMarginRatioByMoney } = await reqMarginRate(code) || {}
    // 更新
    LongMarginRatioByMoney && this.setState({ marginRatio: LongMarginRatioByMoney})
  }

  // 搜索框
  ref_searchInp = e => this.searchInp = e
  // 价格框
  // ref_priceInp = e => this.priceInp = e

  render() {
    // 声明
    const {
      zIndex, state: {
        code, uid, price: { val = '' } = {}, curPosi, actPosDirect, price, volume, quotes: { p } = {}, quotes, marginRatio,
        baseInfo: { PriceTick, marginRate, LongMarginRatio, VolumeMultiple, Precision } = {}, baseInfo,
      },
      setOrderPrice, setOrderCode, clearOrder, setOrder, ref_searchInp,
      handleChangeVolume, handleChangePrice, handleClickPriceBtn, handleButtonClick
      // , PriceInp
    } = this
    // 样式
    const { left, tr, panelWrap, priceWrapStyle, volumeWrapStyle, priceFocusWrapStyle } = styles
    // 渲染
    return <View style={panelWrap}>
      <View style={[tr, zIndex]}>
        <View style={left}>
          <SearchInput ref={ref_searchInp} code={code} baseInfo={baseInfo} clearOrder={clearOrder}
                       setOrderCode={setOrderCode}/>
          {/*<PriceInp*/}
          <NumberInput
            // ref={ref_priceInp}
            value={val}
            label={'价格'}
            unit={''}
            min={0}
            maxLength={9}
            smallestUnit={PriceTick}
            wrapStyle={priceWrapStyle}
            focusWrapStyle={priceFocusWrapStyle}
            onChangeText={handleChangePrice}
            onClickBtn={handleClickPriceBtn}
            FocusExtend={props => <PriceBtn {...props} onClick={setOrderPrice}/>}
          />
          <NumberInput
            value={volume}
            label={'手数'}
            unit={'手'}
            min={1}
            maxLength={6}
            wrapStyle={volumeWrapStyle}
            onChangeText={handleChangeVolume}
          />
          <Margin volume={volume} marginRate={marginRatio || marginRate || LongMarginRatio} VolumeMultiple={VolumeMultiple} price={p}/>
        </View>
        <Quotes uid={uid} setOrder={setOrder} quotes={quotes} setOrderPrice={setOrderPrice}/>
      </View>
      <Buttons
        price={price}
        quotes={quotes}
        curPosi={curPosi}
        Precision={Precision}
        actPosDirect={actPosDirect}
        onClick={handleButtonClick}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  tr: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  left: {
    flex: 1,
    position: 'relative',
    height: rpx(269),
    marginRight: rpx(10)
  },
  priceWrapStyle: {
    // marginTop: rpx(14),
    // marginBottom: rpx(12),
    zIndex: 3,
    position: 'absolute',
    top: rpx(82),
    width: '100%',
  },
  priceFocusWrapStyle: {
    height: rpx(168),
  },
  volumeWrapStyle: {
    // position: 'absolute',
    // width: '100%',
    // top: rpx(162)
    marginTop: rpx(94)
  },
  panelWrap: {
    padding: rpx(10),
    paddingTop: 0
  }
})
