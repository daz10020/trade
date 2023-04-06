// 获取用户名
import { setBanksActions } from './index';
import { reqAccountregister, reqBanks } from '../../socket1/apis'
import { getSingleConf } from '../../conf/tools'
import { EmAlert } from 'emrn-common/components'
import { jumpUrlFunc } from '../../utils/navigation'
import { bankGuide } from '../../conf/htmlUrls'

// 更新委托列表
export const getBanks = _ => async dipatch => {
  try {
    // 获取银期签约关系
    const banks = await reqAccountregister() || []
    // 未签约
    if (!banks.length) return EmAlert({
      title: '温馨提示',
      message: `尚未关联银行卡`,
      buttons: ['暂不关联', '立即关联'],
      onOk: _ => jumpUrlFunc({
        linkType: 1, linkUrl: bankGuide
      })
    })
    // 数据
    const dict =  await getBankDict()
    // 合并
    return dipatch(setBanksActions({
      // 状态
      state: 1,
      // 列表
      list: banks.map(uInfo => {
        // 签约信息
        const { BankAccount = '', BankID } = uInfo
        // 消息
        const { BankName = '' } = dict.find(i => i.BankID === BankID) || {}
        // 合并
        return {
          ...uInfo, BankName,
          bankDesc: `${BankName}${BankAccount.replace(/^(\d{4})(.*)(\d{4})$/, '$1***$3')}`
        }
      })
    }))
  } catch (e) {
    return dipatch(setBanksActions({ state: 2 }))
  }
}

// 银行名称
let bankDict = []
// 获取银行信息
const getBankDict = async _ => {
  // 以获取过
  if (bankDict.length) return bankDict
  try {
    // 更新
    bankDict = await reqBanks()
    // 返回
    return bankDict
  } catch (e) {
    return []
  }

  // // 获取配置
  // return new Promise((resolve, reject) => {
  //   // 获取配置
  //   getSingleConf({
  //     api: 'banks',
  //     getConf: async oconf => {
  //       try {
  //         // 请求
  //         const res = await reqBanks()
  //         // 返回数据
  //         return { MD5: new Date().getTime(), data: res }
  //       } catch (e) {
  //         return oconf
  //       }
  //     },
  //     render: conf => {
  //       // 声明
  //       const { data = [] } = conf
  //       // 返回
  //       if(!data.length) return false
  //       // 更新
  //       banks = data
  //       // 更新
  //       return resolve(data)
  //     }
  //   })
  // })
}

