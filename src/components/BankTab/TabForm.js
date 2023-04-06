import React, { Component } from 'react';
import { View, Platform, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native'
import { getColors } from '../../style'
import { rpx } from 'emrn-common/utils'
import { EmActionSheet, EmAlert } from 'emrn-common/components'
import Field from './Field'
import InputDIY from '../InputDIY'
import ButtonDIY from '../ButtonDIY'
import { reqBankBalance } from '../../socket1/apis'
import { jumpUrlFunc } from '../../utils/navigation'
import { Compat, Toast } from 'emrn-common/utils/hybrid'
import { bankGuide } from '../../conf/htmlUrls'
import { logError } from '../../utils/tools'
import EmImage from 'emrn-common/components/EmImage';
import { getSingleImg } from '../../images';

// 合约搜索
export default class TabForm extends Component {
  constructor(props) {
    super(props)
    // 样式
    this.styles = getCss()
    // 表单
    this.state = {
      bankInfo: null,
      bankPsw: '',
      fundsPsw: '',
      bankBalance: '',
      transVal: ''
    }
  }

  // 查询余额
  handleSelBanlace = _ => {
    // 声明
    const { state: { bankInfo, fundsPsw, bankPsw }, props: { bankList } } = this
    // 资金密码
    if (!bankList.length) return
    // 银行密码
    if (!bankPsw) return EmAlert({ title: '温馨提示', message: '请先输入银行密码' })
    // 资金密码
    if (!fundsPsw) return EmAlert({ title: '温馨提示', message: '请先输入资金密码' })
    // 参数
    const { BankID, BankBranchID, BankAccount, BrokerBranchID, CurrencyID } = bankInfo || bankList[0]
    // 查询余额
    reqBankBalance({
      BankID, BankBranchID, BankAccount, BrokerBranchID, CurrencyID,
      BankPassWord: bankPsw,
      Password: fundsPsw
    }).then(res => {
      // 结果
      const { BankUseAmount = '' } = res || {}
      // 更新
      this.setState({ bankBalance: BankUseAmount || BankUseAmount - 0 === 0 ? Number(BankUseAmount).toFixed(2) : ''})
    })
  }
  // 选择银行
  showBanks = _ => {
    // 声明
    const { bankList } = this.props
    // 少则无需展示
    if (bankList.length < 2) return
    // 选择
    EmActionSheet({
      title: '签约银行', //标题
      cancel: '取消', // 取消按钮文本
      items: bankList.map(info => {
        const { BankID, BankName } = info
        return {
          value: BankID,
          text: BankName,
          info
        }
      }),
      onSelect: (value, { info }) => this.setState({ bankInfo: info })
    })
  }

  // 确定转入
  handleSubmit = async _ => {
    // 声明
    const { state: { fundsPsw, bankPsw, transVal, bankInfo }, props: { bankList, onSubmit, getFunds } } = this
    // 资金密码
    if (!bankList.length) return
    // 银行密码
    if (!bankPsw) return EmAlert({ title: '温馨提示', message: '请先输入银行密码' })
    // 资金密码
    if (!fundsPsw) return EmAlert({ title: '温馨提示', message: '请先输入资金密码' })
    // 资金密码
    if (!transVal) return EmAlert({ title: '温馨提示', message: '请先输入转账金额' })
    // 参数
    const { BankID, BankBranchID, BankAccount, BrokerBranchID, CurrencyID } = bankInfo || bankList[0]
    try {
      // 提交数据
      await onSubmit({
        BankID, BankBranchID, BankAccount, BrokerBranchID, CurrencyID,
        BankPassWord: bankPsw,
        TradeAmount: Number(transVal).toFixed(2),
        Password: fundsPsw
      })
      // 操作成功
      Toast.show({ gravity: 'center', text: '操作成功！' })
      // 刷新资金
      getFunds()
      // 清空表单
      this.setState({ bankPsw: '', fundsPsw: '', transVal: '', bankBalance: '' })
    } catch (e) {
      logError('Banks.onSubmit', e)
    }
  }

  // 输入金额
  handleChangeTransVal = (n = '') => {
    // 格式化
    const nVal = n.replace(/[^\d\.]+/g, '').replace(/^\-/g, '').replace(/\.{2, }/g, '.')
      .replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      .replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
    // 更新
    if (Platform.OS === 'ios' && nVal === this.state.transVal && n !== nVal) {
      this.setState({ transVal: `${nVal} ` })
      setTimeout(_ => {
        this.setState({ transVal: nVal })
      })
    } else {
      // 更新
      this.setState({ transVal: nVal })
    }
  }

  // 输入框
  handleChangeInput = key => n => this.setState({ [key]: n })

  // 银期签约
  jumpToGuide = _ => jumpUrlFunc({ linkType: 1, linkUrl: bankGuide }, 'Banks.toGuide')

  // 找回资金密码
  jumpToForgetPwd = _ => EmAlert({
    title: `温馨提示`,
    message: '请联系客服处理：95357转7',
    buttons: ['取消', '呼叫'],
    onOk: _ => Compat.callTel({ tel: '95357' })
  })

  render() {
    // 声明
    const {
      props: { bankList = [], inps = [], btnBtmTxt = '', btnTxt = '', Funds }, styles,
      state: { bankPsw, fundsPsw, bankBalance, transVal, bankInfo },
      handleSelBanlace, showBanks, handleSubmit, handleChangeTransVal, handleChangeInput, jumpToGuide, jumpToForgetPwd
    } = this
    // 是否已签约
    const bankListLen = bankList.length
    // 显示
    const { bankDesc = '' } = bankInfo || (bankListLen ? bankList[0] : {})
    // 样式
    const { wrap, unit, selBtn, selBtnTxt, desc, subBtnTxt, subBtn, disBtn, bTxt, bankBox, bankTxt, balanceTxt, disSelBtn, disSelBtnTxt, bottomTr, arrow } = styles
    // 渲染
    return <View style={wrap}>
      {
        inps.map(key => key === 'bankList' ? <Field key={key} title={'签约银行'}>
            <TouchableWithoutFeedback onPress={showBanks}>
              <View style={bankBox}>
                <Text style={bankTxt}>{bankDesc}</Text>
                {bankListLen ? <View><EmImage source={getSingleImg('hrArrow')} style={arrow}/></View> : null}
              </View>
            </TouchableWithoutFeedback>
          </Field>
          : key === 'bankPsw' ? <Field key={key} title={'银行密码'}>
              <InputDIY value={bankPsw} placeholder={'请输入银行密码'} secureTextEntry
                        onChangeText={handleChangeInput('bankPsw')}/>
            </Field>
            : key === 'fundsPsw' ? <Field key={key} title={'资金密码'}>
                <InputDIY value={fundsPsw} placeholder={'请输入资金密码'} maxLength={6} secureTextEntry
                          onChangeText={handleChangeInput('fundsPsw')}/>
              </Field>
              : key === 'bankBalance' ? <Field key={key} title={'银行金额'}>
                  <Text style={balanceTxt}>{bankBalance}</Text>
                  <ButtonDIY
                    title={'查询余额'}
                    btnStyle={[selBtn, !bankListLen ? disSelBtn : null]}
                    txtStyle={[selBtnTxt, !bankListLen ? disSelBtnTxt : null]}
                    onClick={handleSelBanlace}
                  />
                </Field>
                : key === 'transVal' ? <Field key={key} title={'转账金额'}>
                    <InputDIY value={transVal} placeholder={'请输入转账金额'} maxLength={15} keyboardType={'numeric'}
                              onChangeText={handleChangeTransVal}/>
                    <View><Text style={unit}>元</Text></View>
                  </Field>
                  : key === 'WithdrawQuota' ? <Field key={key} title={'可转金额'}>
                    <Text style={unit}>{Number(Funds.WithdrawQuota || 0).toFixed(2)}</Text><Text style={unit}>元</Text>
                  </Field> : null
        )}
      <Text style={desc}>资金密码为6位数字密码，初始密码为身份证后六位（X除外）</Text>
      <ButtonDIY title={`确定${btnTxt}`} btnStyle={[subBtn, !bankListLen ? disBtn : null]} txtStyle={subBtnTxt}
                 onClick={handleSubmit}/>
      <Text style={bTxt}>{btnBtmTxt}</Text>
      <View style={bottomTr}>
        <ButtonDIY title={'银期签约指南'} txtStyle={selBtnTxt} onClick={jumpToGuide}/>
        <ButtonDIY title={'忘记资金密码'} txtStyle={selBtnTxt} onClick={jumpToForgetPwd}/>
      </View>
    </View>
  }
}


const getCss = _ => {
  // 当前皮肤
  const { txt, Bank: { bg, txt: bTxt }, themeColor, dis } = getColors('txt,Bank,themeColor,dis')

  return StyleSheet.create({
    wrap: {
      flex: 1,
      paddingTop: rpx(10),
      backgroundColor: bg,
    },
    selBtn: {
      borderWidth: rpx(1),
      borderColor: themeColor,
      height: rpx(60),
      justifyContent: 'center',
      paddingLeft: rpx(10),
      paddingRight: rpx(10)
    },
    selBtnTxt: {
      fontSize: rpx(28),
      color: themeColor
    },
    disSelBtn: {
      borderColor: dis,
    },
    disSelBtnTxt: {
      color: dis
    },
    unit: {
      fontSize: rpx(28),
      paddingLeft: rpx(10),
      color: txt,
    },
    desc: {
      fontSize: rpx(24),
      color: '#999',
      marginTop: rpx(10),
      marginBottom: rpx(10),
      paddingLeft: rpx(36)
    },
    subBtn: {
      marginLeft: rpx(36),
      marginRight: rpx(36),
      borderRadius: rpx(8),
      backgroundColor: themeColor,
      height: rpx(80),
      justifyContent: 'center',
      alignItems: 'center'
    },
    disBtn: {
      backgroundColor: dis
    },
    subBtnTxt: {
      color: '#fff',
      fontSize: rpx(30)
    },
    bTxt: {
      color: bTxt,
      fontSize: rpx(28),
      paddingLeft: rpx(36)
    },
    bankBox: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    bankTxt: {
      fontSize: rpx(28),
      color: txt
    },
    balanceTxt: {
      color: txt
    },
    bottomTr: {
      marginTop: rpx(16),
      paddingLeft: rpx(36),
      paddingRight: rpx(36),
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    arrow: {
      width: rpx(24),
      height: rpx(14),
      transform: [{ rotate: '-180deg' }]
    }
  })
}
