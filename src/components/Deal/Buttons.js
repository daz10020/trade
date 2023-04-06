import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native'
import ButtonDIY from '../ButtonDIY'
import { rpx } from 'emrn-common/utils'

// 合约搜索
export default class Buttons extends PureComponent {
  constructor(props) {
    super(props)

    this.btns = [
      { label: '买多', l2: '加多', type: 2, bg: 'FC3438' },
      { label: '卖空', l2: '加空', type: 3, bg: '00A000' },
      { label: '平仓', type: 0, bg: '3381E3' },
    ]

    // 价格类型、买卖方向对应取值
    this.PRICE_TYPE_KEY = [
      ['mcj', 'p', 'zt', 'mrj'],
      ['mrj', 'p', 'dt', 'mcj']
    ]
    this.styles = getCss()
  }

  // 格式化按钮文字
  fmtParams = (btn, props, posDirct) => {
    const { pcFmt, fmtPrice, fmtTxt } = this
    const { quotes, price } = props
    // 按钮参数
    const { type: btnType, label } = btn
    // 无行情则空
    if (!quotes) return {
      txt: label,
      price: ''
    }
    // 平仓逻辑
    return !btnType ? pcFmt(props, posDirct)
      : {
        price: fmtPrice(price, quotes, btnType - 2),
        txt: fmtTxt(btn, posDirct),
        direction: btnType - 2,
        offsetFlg: 0
      }
  }

  // 具体价格
  fmtPrice = (price, quotes, BorS) => {
    const { PRICE_TYPE_KEY } = this
    // 声明
    const { type, val } = price || {}
    // 清空价格时
    if (!val) return '--'
    // 有价格直接使用
    if (!type) return val
    // 行情
    const qVal = quotes[PRICE_TYPE_KEY[BorS][type - 1]]
    // 价格类型
    return qVal && !/\-/.test(qVal) ? qVal : 0
  }

  // 按钮文字
  fmtTxt = (btn, posDirct) => {
    // 按钮参数
    const { type: btnType, label, l2 } = btn
    // 无持仓
    if (!posDirct.length) return label
    // 根据现有持仓判断
    return posDirct.some(d => d === btnType) ? l2 : '锁仓'
  }

  // 平仓
  pcFmt = (props, curPosDirct) => {
    // 声明
    const { fmtPrice } = this
    const { quotes, price, actPosDirect } = props
    // 当前选中持仓方向
    const posDirct = actPosDirect === undefined ? curPosDirct : [actPosDirect]
    // 按钮参数
    let p = price ? '' : '--'
    // 按钮文字
    let txt = '平仓'
    // 交易方向
    let direction = -1
    // 当前合约持仓
    const len = posDirct.length
    // 无持仓
    if (!len) {
      p = '无持仓'
    } else if (len === 2) {
      p = '锁仓状态'
    } else if (len === 1) {
      // 与选中持仓相反
      direction = posDirct[0] === 2 ? 1 : 0
      // 价格
      p = fmtPrice(price, quotes, direction)
      // 双边持仓
      curPosDirct.length > 1 && (txt = `平${direction ? '多' : '空'}单`)
    }

    return { price: p, txt, direction, offsetFlg: 1 }
  }

  render() {
    // 声明
    const { props: { onClick, curPosi, Precision }, props, fmtParams, btns, styles } = this
    // 样式
    const { btnWrap, btnStyle, btnTxt } = styles
    // 查看持仓方向
    const posDirct = curPosi.map(item => item._posiDirection)
    // 渲染
    return <View style={btnWrap}>
      {
        btns.map(btn => {
          const { type, bg } = btn
          // 格式化参数
          const params = fmtParams(btn, props, posDirct)
          const { price, txt } = params
          // 渲染
          return <ButtonDIY
            key={type}
            title={`${price ? (typeof price === 'number' ? price.toFixed(Precision) : price) + '\n' : ''}${txt}`}
            btnStyle={[btnStyle, { backgroundColor: `#${bg}` }]}
            txtStyle={btnTxt}
            onClick={_ => onClick(params)}
          />
        })
      }
    </View>
  }
}

const getCss = _ => StyleSheet.create({
  btnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: rpx(14),
    marginBottom: rpx(20)
  },
  btnStyle: {
    // flex: 1,
    borderRadius: rpx(6),
    width: rpx(214),
    height: rpx(90),
    // marginRight: rpx(15),
    // marginLeft: rpx(15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTxt: {
    fontSize: rpx(32),
    color: '#fff',
    textAlign: 'center'
  }
})
