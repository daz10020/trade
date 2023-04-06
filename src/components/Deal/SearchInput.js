import React, { PureComponent } from 'react';
import { View, FlatList, TouchableWithoutFeedback, StyleSheet, Text, TextInput, Platform, Keyboard } from 'react-native'
import { EmAlert } from 'emrn-common/components'
import { getSingleImg } from '../../images/index'
import { getColors } from '../../style'
import rpx from 'emrn-common/utils/rpx'
import { Stock } from 'emrn-common/utils/hybrid'
import { transUid } from '../../utils/Futures'
import Line from '../Line'
import { getGlobalData } from '../../conf/tools'

// 合约搜索
export default class SearchInput extends PureComponent {
  constructor(props) {
    super(props)
    // 主次
    const { ids: zcIds = {} } = getGlobalData('ZhuChi') || {}
    const { appVersionCode } = getGlobalData('AppInfo') || {}
    // 合并
    Object.assign(this, {
      placeholderColor: getColors('placeholder'),
      // 图片
      iconImg: getSingleImg('search'),
      // 样式
      styles: getCss(),
      searchConf: {
        limit: 50,
        data: [{ market: Number(appVersionCode) < 10005000 ? 8 : 220 }, { market: 113 }, { market: 114 }, { market: 115 }, { market: 142 }, { market: 225 }]
      },
      // 主次
      zcIds,
      // 输入框
      inp: null,
      // 状态
      state: {
        val: '',
        name: '',
        list: [],
        showFlg: false
      }
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 声明
    const { code: n_code, baseInfo } = nextProps
    const { props: { code: o_code }, state: { val, name } } = this
    // 清空
    if (!n_code && o_code && val) {
      this.setState({ name: '' })
    } else if (n_code !== o_code) {
      this.setState({ val: n_code, name: baseInfo ? baseInfo.ClientInstrumentName : '', showFlg: false })
    } else if (o_code && !name && baseInfo) {
      this.setState({ name: baseInfo.ClientInstrumentName })
    }
  }

  // 重置
  _clear = _ => {
    this.setState({ val: '', name: '', showFlg: false, list: [] })
  }

  handleChangeInput = async n => {
    // 判断更新
    this.setState({ val: n })
    // 清理表单
    const { props: { clearOrder, code }, _selectItem, _clear, zcIds, searchConf } = this
    // 搜索结果
    const { result = [] } = await Stock.stockSearch({ ...searchConf, input: n })
    // console.log(result)
    // 格式化
    const fmtList = result.length ? result.reduce((list, item) => {
      // 声明
      const { Name, MarketNum, Code } = item
        // 添加
      ;!/主力|连续|\(/.test(Name) && list.push({ ...item, mainFlag: zcIds[`${MarketNum}|${Code}`] })
      // 下一轮
      return list
    }, []) : []
    // console.log(fmtList)
    // 填充
    // 查询结果
    const { length = 0, '0': fstObj = {} } = fmtList
    // 填充
    if (length > 1) {
      this.setState({ list: fmtList.filter(({ mainFlag }) => mainFlag !== undefined), showFlg: true })
    } else if (length === 1) {
      // 第一个
      const { Code, Name } = fstObj
      // 输入
      const nStr = n.toLowerCase();
      // 比较
      (nStr === Code.toLowerCase() || nStr === Name.toLowerCase()) && _selectItem(fstObj)
      // 无数据则清空
    } else if (!length && n) {
      // 清空
      _clear()
      // 提示
      EmAlert({ title: '提示', message: '合约代码不存在' })
    }
    // 清理表单
    code && clearOrder(true)
  }

  // 选中
  _selectItem = item => {
    // 失去焦点
    Keyboard.dismiss()
    // this.inp.focus()
    // 防止报错
    if (!item) return
    // 声明
    const { Name, Code, MarketNum } = item
    // 编码
    let code = Code
    // uid
    let uid = transUid(item, { mktKey: 'MarketNum', codeKey: 'Code' })
    // 如果是中金所
    if (MarketNum === '8') {
      code = Name
      uid = `${MarketNum}_${Code}`
    }
    // 名称
    this.setState({ name: Name, showFlg: false, list: [] })
    // 填充数据
    return this.props.setOrderCode({ code, uid, volume: '1', price: { val: '对手价', type: 1 } })
  }

  // 节点
  // setRef = e => this.inp = e

  render() {
    // 声明
    const { handleChangeInput, _selectItem, state: { val, name, list, showFlg }, setRef, styles, placeholderColor } = this
    // 样式
    const { wrap, inputWrap, inp, nameBox, nameTxt, hide, selectWrap, txt, th, tr, selectList, thTxt } = styles

    // 渲染
    return <View style={wrap}>
      <View style={inputWrap}>
        <TextInput
          // ref={setRef}
          value={val}
          style={inp}
          onChangeText={handleChangeInput}
          underlineColorAndroid='transparent'
          placeholder={'请输入合约名称'}
          placeholderTextColor={placeholderColor}
          // placeholder={'输入代码、名称或简拼'}
        />
        <View style={nameBox}>
          <Text style={name ? nameTxt : hide}>{name}</Text>
        </View>
      </View>
      <View style={[selectWrap, showFlg && list.length && val ? null : hide]}>
        <FlatList
          data={list}
          style={selectList}
          getItemLayout={searchItemLayout}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={<View style={[tr, th]}>
            <Text style={thTxt}>代码</Text>
            <Text style={thTxt}>名称</Text>
            <Text style={thTxt}>状态</Text>
          </View>}
          ItemSeparatorComponent={Line}
          keyboardShouldPersistTaps='handled'
          renderItem={({ item, item: { Code, Name, mainFlag } }) =>
            <TouchableWithoutFeedback key={Code} onPress={_ => _selectItem(item)}>
              <View style={tr}>
                <Text style={txt}>{Code}</Text>
                <Text style={txt}>{Name}</Text>
                <Text style={txt}>{mainFlag === undefined ? '' : `${mainFlag === 1 ? '次' : ''}主力`}</Text>
              </View>
            </TouchableWithoutFeedback>
          }
        />
      </View>
    </View>
  }
}

const isIos = Platform.OS === 'ios'
const searchItemHeight = rpx(50)
const searchItemLayout = (data, index) => (
  { length: searchItemHeight, offset: searchItemHeight * index, index }
)
const getCss = _ => {
  // 当前皮肤
  const { search: { bg, th }, txt, lineColor, homeBg, contractInp: { border }, Margin: { txt: inpTxt } } = getColors('txt,search,lineColor,homeBg,contractInp,Margin')
  // const h = rpx(74)
  const h = rpx(68)

  return StyleSheet.create({
    hide: {
      width: 0,
      height: 0,
      borderWidth: 0,
      padding: 0,
    },
    wrap: {
      position: 'relative',
      zIndex: isIos ? 8 : undefined
    },
    inputWrap: {
      borderRadius: rpx(6),
      borderWidth: rpx(1),
      borderColor: border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: h,
    },
    inp: {
      flex: 1,
      padding: 0,
      color: inpTxt,
      paddingLeft: rpx(26),
      fontSize: rpx(26),
      height: rpx(120)
    },
    nameBox: {
      borderLeftWidth: rpx(1),
      borderColor: lineColor,
      paddingLeft: rpx(10),
      paddingRight: rpx(10),
    },
    nameTxt: {
      color: txt
    },
    iconBox: {
      flexShrink: 0,
      width: h,
      height: h - rpx(2),
      backgroundColor: bg,
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      width: rpx(38),
      height: rpx(38)
    },
    selectWrap: {
      position: 'absolute',
      top: h,
      left: 0,
      width: '100%',
      height: rpx(220),
      backgroundColor: homeBg,
      borderWidth: rpx(1),
      borderColor: lineColor,
      zIndex: 11
    },
    selectList: {
      flex: 1
    },
    th: {
      height: rpx(60),
      backgroundColor: th,
    },
    thTxt: {
      color: '#666',
      fontSize: rpx(22),
      flex: 1,
      textAlign: 'center'
    },
    tr: {
      height: searchItemHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    txt: {
      color: '#999',
      fontSize: rpx(22),
      flex: 1,
      textAlign: 'center',
    },
    line: {
      backgroundColor: lineColor,
      height: rpx(1),
      width: '100%'
    }
  })
}
