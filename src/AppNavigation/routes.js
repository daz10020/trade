// import Home from '../pages/Home'
import Login from '../pages/Login'
import Bill from '../pages/Bill'
import Main from '../pages/Main'
import Banks from '../pages/Banks'
import AccDetails from '../pages/AccDetails'
import Setting from '../pages/Setting'
import HeaderRight from '../components/Main/HeaderRight'
import HeaderTitle from '../components/Main/HeaderTitle'
import React from 'react'

export default {
  // Home: {
  //   screen: Home,
  //   navigationOptions: {
  //     title: '期货交易',
  //   }
  // },
  Login: {
    screen: Login,
    navigationOptions: {
      title: '期货交易',
    }
  },
  Bill: {
    screen: Bill,
    navigationOptions: {
      title: '结算单确认',
    }
  },
  Main: {
    screen: Main,
    navigationOptions: {
      // title: '期货交易',
      headerTitle: <HeaderTitle/>,
      headerRight: <HeaderRight/>
    }
  },
  Banks: {
    screen: Banks,
    navigationOptions: {
      title: '银期转账',
    }
  },
  AccDetails: {
    screen: AccDetails,
    navigationOptions: {
      title: '资金详情',
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      title: '系统设置',
    }
  }
}
