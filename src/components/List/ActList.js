import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { toQuotesFunc } from '../../utils/navigation'
import { getColors } from '../../style';
import List, { ITEM_HEIGHT } from '../List'
import ButtonDIY from '../ButtonDIY'
import rpx from 'emrn-common/utils/rpx'

export default class ActList extends PureComponent {
  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
    // 状态
    this.state = {
      actId: '',
    }
  }

  componentDidMount() {
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return shouldUpdate(nextProps, nextState, this)
  // }

  _clearAct = _ => this.setState({ actId: '' })

  // 行点击
  _clickRow = (id, row) => _ => {
    // 声明
    const { props: { onClickRow }, state: { actId } } = this
    // 高亮
    this.setState({ actId: id === actId ? '' : id })
    // 点击
    typeof onClickRow === 'function' && onClickRow(row)
  }
  // // 行情
  // _toQuotes = params => {
  //   console.log(params)
  //   // 声明
  //   const { ClientInstrumentName, InstrumentName, EMInstumentID, ExchangeID } = params
  //   // id
  //   const uid = `${ExchangeID !== 'CFFEX' ? ExchangeID : 8}|${EMInstumentID}`
  //   // 名称
  //   const name = ExchangeID !== 'CFFEX' ? InstrumentName : ClientInstrumentName
  //   // 格式化
  //   openDeepLink({
  //     ios: ``,
  //     android: ` `
  //   }, 'aclItem.item')
  // }

  render() {
    // 声明
    const {
      state: { actId }, props: { list, onRefresh, thead, Item, listOptions, leftBtn: { title, onClick }, tipTxt }, props,
      _clickRow, _toQuotes, styles
    } = this
    // 样式
    const { btnRow, btnStyle, btnTxtStyle, tr, act, cont } = styles
    // 渲染
    return <List
      thead={thead}
      list={list}
      keyExtractor={item => item.id}
      onRefresh={onRefresh}
      tipTxt={tipTxt}
      renderItem={({ item }) => {
        // ID
        const { id } = item
        // 高亮
        const active = actId === id
        return <TouchableWithoutFeedback onPress={_clickRow(id, item)}>
          <View style={[tr, active ? act : null]}>
            <View style={cont}>
              <Item {...item}/>
            </View>
            {
              active && <View style={btnRow}>
                <ButtonDIY key={title} title={title} onClick={_ => onClick(item, props)}
                           btnStyle={btnStyle} txtStyle={btnTxtStyle}/>
                <ButtonDIY title={'行情'} onClick={toQuotesFunc(item, 'actList.item')} btnStyle={btnStyle}
                           txtStyle={btnTxtStyle}/>
              </View>
            }
          </View>
        </TouchableWithoutFeedback>
      }}
      {...listOptions}
    />
  }
}

// 样式
const getCss = _ => {
  const { themeColor, deal: { lineBtnBdr, lineBtnBg, lineBg }, homeBg } = getColors('deal,themeColor,homeBg')
  return StyleSheet.create({
    tr: {
      backgroundColor: homeBg,
    },
    cont: {
      flex: 1,
      minHeight: rpx(ITEM_HEIGHT - 1),
    },
    act: {
      backgroundColor: lineBg,
    },
    btnRow: {
      width: '100%',
      height: rpx(80),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    hide: {
      width: 0,
      height: 0,
      padding: 0
    },
    btnStyle: {
      borderRadius: rpx(8),
      height: rpx(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: rpx(1),
      borderColor: lineBtnBdr,
      backgroundColor: lineBtnBg,
      width: rpx(180),
      marginRight: rpx(30)
    },
    btnTxtStyle: {
      color: themeColor,
      fontSize: rpx(26)
    }
  })
}
