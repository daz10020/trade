import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BankTab from '../components/BankTab'
import { getFunds } from '../store/actions/funds'
import { getBanks } from '../store/actions/banks'
import { getGlobalData } from '../conf/tools'
import { pageTracker } from '../utils/tools'

class BankPage extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.getBaseInfo()
  }

  // 获取结果
  getBaseInfo = _ => {
    // 参数
    const { page } = getGlobalData('StartupParams') || {}
    // 直接打开页面不发请求
    if (page === 'Banks') return
    // 获取
    this.props.getBanks()
  }

  // // 获取结果
  // getBaseInfo = async _ => {
  //   const { hasBanks, fmtData } = this
  //   try {
  //     // 获取银期签约关系
  //     const banks = await reqAccountregister()
  //     console.log('---------------Banks-----------------')
  //     console.log(banks)
  //     // 未签约则返回
  //     if (hasBanks(banks)) return
  //     // 格式化
  //     const bankList = await fmtData(banks)
  //     // 渲染
  //     this.setState({ bankList })
  //   } catch (error) {
  //     logError(`bank.getBanks`, error)
  //   }
  // }
  //
  // fmtData = async list => {
  //   // 缓存
  //   const { bankInfo, getBanks } = this
  //   try {
  //     // 数据
  //     const bankInfos = bankInfo.length ? bankInfo : await getBanks()
  //     // 合并
  //     return list.map(uInfo => {
  //       // 签约信息
  //       const { BankAccount, BankID } = uInfo
  //       // 消息
  //       const { BankName = '' } = bankInfos.find(i => i.BankID === BankID) || {}
  //       // 合并
  //       return {
  //         ...uInfo, BankName,
  //         bankDesc: `${BankName}${BankAccount.replace(/^(\d{4})(.*)(\d{4})$/, '$1***$3')}`
  //       }
  //     })
  //   } catch (e) {
  //     return list
  //   }
  // }
  //
  //
  // getBanks = async _ => {
  //   // 银行
  //   const { banks } = this
  //   // 以获取过
  //   if (banks.length) return banks
  //   // 获取配置
  //   return new Promise((resolve, reject) => {
  //     // 获取配置
  //     getSingleConf({
  //       api: 'banks',
  //       getConf: async oconf => {
  //         try {
  //           // 请求
  //           const res = await reqBanks()
  //           // 返回数据
  //           return { MD5: new Date().getTime(), data: res }
  //         } catch (e) {
  //           return oconf
  //         }
  //       },
  //       render: conf => {
  //         // 声明
  //         const { data = [] } = conf
  //         // 返回
  //         if(!data.length) return false
  //         // 更新
  //         this.banks = data
  //         // 更新
  //         return resolve(data)
  //       }
  //     })
  //   })
  // }
  //
  // hasBanks = Banks => {
  //   // 已签约
  //   if (Banks.length || this.state.bankList.length) return false
  //   // 提醒
  //   return EmAlert({
  //     title: '温馨提示',
  //     message: `尚未关联银行卡`,
  //     buttons: ['暂不关联', '立即关联'],
  //     onOk: _ => jumpUrlFunc({
  //       linkType: 1, linkUrl: bankGuide
  //     })
  //   })
  // }

  render() {
    // 声明
    const { Funds, getFunds, Banks: { list = [] } = {} } = this.props
    // 组件
    return <BankTab bankList={list} Funds={Funds} getFunds={getFunds}/>
  }
}

const mapStateToProps = ({ Banks, Funds }) => ({ Funds, Banks })

const mapDispatchToProps = dispatch => bindActionCreators({
  getFunds, getBanks
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(pageTracker(BankPage, 'Bank'));
