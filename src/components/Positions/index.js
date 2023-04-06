import React, { PureComponent } from 'react'
import { FlatList, RefreshControl, View, Text } from 'react-native'
import Item from './Item'
import Thead from '../Thead'
import Total from './Total'
import { EmAlert } from 'emrn-common/components'
import Line from '../Line'
import { getColors } from '../../style'
import { Toast } from 'emrn-common/utils/hybrid';


export default class PositionsList extends PureComponent {
  constructor(props) {
    super(props)

    // 创建
    Object.assign(this, {
      // 头
      thead: ['合约/方向', { txt: '手数/可平', style: { width: '18%', flex: 0 } }, '现价/成本', '总盈亏/保证金'],
      // 样式
      wrapCss: wrapCss(),
      // 初始化状态
      initFlg: true,
      // 状态
      state: {
        actId: ''
      }
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 初始化状态
    this.initFlg = false
    // 声明
    const { Positions: nPosi } = nextProps
    const { props: { Positions: oPosi }, state: { actId } } = this
    // 若已交易则清除高亮
    actId && nPosi.length !== oPosi.length && nPosi.every(item => item.id !== actId) && this.setState({ actId: '' })
  }

  // 清理
  _clearAct = _ => this.state.actId && this.setState({ actId: '' })

  // 行点击
  _clickRow = (id, row) => {
    // 声明
    const { props: { onClickRow }, state: { actId } } = this
    // 高亮
    this.setState({ actId: id === actId ? '' : id })
    // 点击
    typeof onClickRow === 'function' && onClickRow(row)
  }

  // 平仓
  _closePositions = params => {
    // 声明
    const { InstrumentID, ClientInstrumentName = '', ExchangeID, _longFlg, mcj, mrj, _usePosition } = params
    // 可用为0
    if (!_usePosition) return EmAlert({ title: '温馨提示', message: '合约可用手数为0，请先撤单后尝试平仓。' })
    // 交易方向
    const direction = _longFlg ? 1 : 0
    // 价格
    const price = direction ? mrj : mcj
    console.log(params)
    // 价格
    if (!price || price === '--' || price === '-') return Toast.show({ gravity: 'center', text: '请输入价格' })
    // 提示
    EmAlert({
      title: `下单确认`,
      message: <View>
        <Text>合约名称：{ClientInstrumentName}</Text>
        <Text>交易方向：{direction ? '卖出' : '买入'}平仓</Text>
        <Text>委托价格：{price}</Text>
        <Text>委托数量：{_usePosition}</Text>
      </View>,
      buttons: ['取消', '确定'],
      onOk: _ => this.props.submitOrder({
        ExchangeID, code: InstrumentID, direction, price, offsetFlg: 1, volume: _usePosition, curPosi: [params]
      })
    })
  }

  render() {
    // 声明
    const {
      state: { actId }, props: { Funds, Positions, getPositions, disRefresh },
      wrapCss, initFlg, _clickRow, _closePositions, thead
    } = this
    // 样式
    // console.log('----------------posi--------------')
    // console.log(Positions)
    // console.log(Funds)
    // 刷新标记
    const refreshFlg = initFlg && !Funds.AccountID
    // console.log(refreshFlg)

    return <FlatList
      style={wrapCss}
      data={Positions.filter(i => !i.optionsType)}
      keyExtractor={item => item.id}
      stickyHeaderIndices={[0]}
      keyboardShouldPersistTaps={'handled'}
      ListHeaderComponent={<Thead column={thead}/>}
      refreshControl={disRefresh ? null : <RefreshControl refreshing={refreshFlg} onRefresh={getPositions}/>}
      ListFooterComponent={<Total {...Funds} length={Positions.length}/>}
      ItemSeparatorComponent={Line}
      renderItem={({ item }) => <Item
        {...item}
        active={item.id === actId}
        _clickRow={_clickRow}
        _closePositions={_closePositions}
      />}
    />
  }
}

const wrapCss = _ => {
  const { tabBarBg } = getColors('deal')
  return {
    backgroundColor: tabBarBg,
    flex: 1
  }
}
