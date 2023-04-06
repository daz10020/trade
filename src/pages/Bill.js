import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmLoading from 'emrn-common/components/EmLoading';
import Bill from '../components/Bill'
import { reqVerifyDetail } from '../socket1/apis'
import { setVerify } from '../store/actions/user'
import { getInfoByPage } from '../store/actions/pages'
import { resetRoute } from '../utils/navigation'
import socket from '../socket1'

class BillPage extends Component {

  constructor(props) {
    super(props)
    // 蒙层
    this.loading = null
    // 是否已经确认
    this.isVerify = false
    // 内容
    this.state = {
      html: ''
    }
  }

  componentDidMount() {
    this.getHtml()
  }

  componentWillUnmount() {
    // 声明
    const { loading, isVerify } = this
    // 销毁蒙层
    loading && loading.destroy()
    // 中断链接
    !isVerify && socket._reset()
  }

  // 获取结果
  getHtml = async _ => {
    const loading = EmLoading('加载中')
    this.loading = loading
    try {
      // 获取结算单信息
      const res = await reqVerifyDetail()
      // 渲染
      this.setState({ html: res.Content })
    }catch (error) {
      // 渲染
      this.setState({ html: typeof error === 'object' && error.resultCode === -212 ? '212' : 'error' })
    } finally {
      // 销毁蒙层
      loading.destroy()
    }
  }

  // 确认
  handleVerify = async _ => {
    // 声明
    const { setVerify, getInfoByPage } = this.props
    // 销毁蒙层
    const loading = EmLoading('加载中')
    // 蒙层
    this.loading = loading
    // 确认结算单
    await setVerify()
    // 销毁蒙层
    loading.destroy()
    // 已经确认
    this.isVerify = true
    // 初始化路由
    getInfoByPage(resetRoute())
  }

  render() {
    // 单据内容
    const { handleVerify, state: { html } } = this

    return <Bill html={html} handleVerify={handleVerify}/>
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setVerify, getInfoByPage
}, dispatch)

export default connect(null, mapDispatchToProps)(BillPage);
