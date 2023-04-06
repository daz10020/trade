import React, { Component } from 'react'
import AccDetails from '../components/AccDetails'
import * as FundsActions from '../store/actions/funds';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

class AccDetailsPage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { Positions, Deal, Funds, getFunds } = this.props

    return <AccDetails Positions={Positions} Deal={Deal} Funds={Funds} disSSE={true} getFunds={getFunds}/>
  }
}


const mapStateToProps = state => {
  // 声明
  const { Positions, Deal, Funds } = state
  // 返回
  return ({ Positions, Deal, Funds })
}

const mapDispatchToProps = dispatch => bindActionCreators({ ...FundsActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AccDetailsPage);
