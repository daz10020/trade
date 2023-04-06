import { formatDateTime } from 'emrn-common/utils/format';
import { EmAlert, EmLoading } from 'emrn-common/components'
import { setUserListActions, setUserItemActions, delUserItemActions } from './index';
import { clearAccountInfo } from './funds'
import { getUserInfo, getUserInfoById, resetUserState } from '../reducers/user'
import { delCache, getUsersCache, setUsersCache, getCache, setCache } from '../../utils/cache'
import { logError } from '../../utils/tools'
import { resetRoute } from '../../utils/navigation'
import socket from '../../socket1'
import { postVerify, reqUserInfo, reqVerifyResult } from '../../socket1/apis'
import { getInfoByPage } from './pages'
import { USERMSG } from '../../components/Login'
import store from '../index'

// 获取缓存用户信息
export const getLoginState = StartupParams => async (dispatch, getState) => {
  // await delCache('Login')
  const { isReset, appIdx } = StartupParams
  // 获取缓存
  const { timestamp = 0, userList: cacheList = [] } = await getUsersCache() || {}
  // 时间
  const dtFlg = new Date().getTime() - timestamp > 2 * 60 * 60 * 1000
  // 首次创建
  const isFirstRender = typeof appIdx === 'undefined'
  // 是否重置
  const resetFlg = cacheList.length && (dtFlg || isReset || isFirstRender)
  // 过期重置 | 强制重置
  let resetList = resetFlg ? resetUserState(cacheList) : cacheList
  // 登录信息
  const cacheInfo = getUserInfo(resetList) || {}
  // 登录id
  const { userId } = cacheInfo
  // 是否登录
  let isLogin = Boolean(userId)
  // 无登录状态
  if (!userId) {
    // 更新结果
    isLogin = false
  } else if (!isFirstRender) {
    // 是否需要重连
    let reconnectFlg = true
    // 后续页面
    if (appIdx) {
      // 当前列表
      const { userList: storeList = [] } = getState()
      // 目前
      const { userId: storeUserId } = getUserInfo(storeList) || {}
      // 需登录
      if (storeUserId) {
        // 无需重连
        reconnectFlg = false
        // 非同一账号
        if (userId !== storeUserId) {
          // 更新结果
          isLogin = false
          // 重置用户信息
          resetList = resetUserState(resetList)
        }
      }
    }
    // 重新登录
    reconnectFlg && socket._connect(cacheInfo).then(_ => {
      // 更新
      dispatch(getInfoByPage(resetRoute()))
    })
  }
  // 登出
  if(!isLogin && !isFirstRender) {
    // 清理资金信息
    dispatch(clearAccountInfo)
    // 重置链接
    socket._reset()
  }
  // 用户
  dispatch(setUserListActions(resetList))
  // 缓存
  setUsersCache(resetList)
  // 登录
  return isLogin
}

// 刷新登录状态
export const refreshLoginState = _ => async (dispatch, getState) => {
  // 新列表缓存到本地
  setUsersCache(getState().userList)
}

// 移除用户信息
export const removeUserInfo = userInfo => _ => dispatch => {
  // 用户ID
  const { userId } = userInfo
  EmAlert({
    title: '删除用户',
    message: `用户：${userId}\n确定删除该资金账号？`,
    buttons: ['取消', '确定'],
    onOk: _ => {
      // 更新用户信息
      const nlist = store.dispatch(delUserItemActions({userId}))
      // console.log(nlist)
      // 新列表缓存到本地
      setUsersCache(nlist)

      // 登录页账号区分是否首次登录勾选风险揭示书,删除后下次登录算首次登录
      const func = async _ => {
        const userStorage = (await getCache(USERMSG)) || []
        if ( userStorage ) {
          const list = userStorage.filter(item => userId !== item)
          setCache(USERMSG, JSON.stringify(list))
        }
      }
      func()

    }
  })
}

let loading;

// 登录
export const login = params => async (dispatch, getState) => {
  // return dispatch(clearAccountInfo)
  // 蒙层
  loading && loading.destroy()
  loading = EmLoading('登录中')
  // 参数
  const { userId } = params
  try {
    // 登录
    const { Token, hasChangeLine } = await socket.login(params)
    // 用户列表
    const { userList } = getState()
    // console.log(userList)
    // 用户信息
    const { confirmDate } = getUserInfoById(userList, userId) || {}
    // 当前日期
    const dt = formatDateTime(new Date(), 'yyyyMMdd')
    // 已经确认过
    const hasConfirm = dt === confirmDate
    // 登录信息
    dispatch(setUserItemActions({ userId, token: Token, online: hasConfirm }))
    // 本地确认记录
    if (hasConfirm && !hasChangeLine) {
      // 用户名
      // await Promise.all([dispatch(getUserName()), dispatch(getAccountInfo())])
      dispatch(getUserName())
      // 账户信息
      // dispatch(getAccountInfo())
      // 清理蒙层
      loading.destroy()
      // 确认结算单
      postVerify()
    } else {
      // 获取结果
      const res = await dispatch(getVerifyResult())
      // 清理蒙层
      loading.destroy()
      // 返回结果
      return res
    }
  } catch (e) {
    // 清理蒙层
    loading.destroy()
    // 停掉
    socket._reset()
    // console.log('reqLogin_error')
    if(e !== 'LocationPermiss') {
      // 错误日志
      logError('Socket.Login', e)
    }
    // 停止
    return Promise.reject(e)
  }
}

// 登出
export const loginOut = _ => async (dispatch, getState) => {
  // 新数组
  const { userId } = getUserInfo(getState().userList) || {}
  // 存在登录状态
  if (!userId) return
  // 蒙层
  loading && loading.destroy()
  loading = EmLoading('')
  try {
    // 登出
    // await reqLogout(userId)
    // 清理登录状态
    dispatch(resetInfo)()
    // 重置
    socket._clear()
  } catch (e) {
    logError('Socket.logout', e)
  } finally {
    // 清理蒙层
    loading.destroy()
  }
}

// // 快捷登录
// export const fastLogin = userId => async (dispatch, getState) => {
//   // 蒙层
//   // const loading = EmLoading('切换账号中')
//   try {
//     // 登出
//     await dispatch(loginOut())
//     // 获取缓存用户信息
//     // const { token } = getUserInfoById(getState(), userId) || {}
//     // 登录
//     // await dispatch(login({ userId, token }))
//   } catch (e) {
//     // 登录页面
//     // jumpUrlFunc({ linkType: 3, linkUrl: 'Login' })
//   } finally {
//     // 销毁蒙层
//     // loading && loading.destroy()
//   }
// }

// 获取用户名
export const getUserName = _ => async (dispatch, getState) => {
  // 声明
  const { name } = getUserInfo(getState().userList) || {}
  // 如果有名称则不获取
  if (name) return name
  // 获取用户信息
  const { InvestorName } = await reqUserInfo()
  // 设置用户名
  return InvestorName
}

// 结算单确认
export const getVerifyResult = _ => async dispatch => {
  try {
    // 用户信息
    const { InvestorID } = await reqVerifyResult()
    // 用户名
    const name = await dispatch(getUserName())
    // 登录信息
    dispatch(setUserItemActions({
      name,
      userId: InvestorID,
      online: true,
      confirmDate: formatDateTime(new Date(), 'yyyyMMdd')
    }))
  } catch (e) {
    // 返回错误码
    return { resultCode: 'toBill' }
  }
}

// 确认结算单
export const setVerify = _ => dispatch => {
  // 获取结算单确认
  return postVerify().then(async res => {
    // 用户信息
    const { InvestorID } = res
    // 用户名
    const name = await dispatch(getUserName())
    // 登录信息
    dispatch(setUserItemActions({
      name,
      userId: InvestorID,
      online: true,
      confirmDate: formatDateTime(new Date(), 'yyyyMMdd')
    }))
  })
}

// 重登
export const refreshInfo = dispatch => async res => {
  // 获取缓存用户信息
  const { UserID, Token } = res
  // 登录信息
  dispatch(setUserItemActions({ userId: UserID, token: Token }))
  // 账户信息
  dispatch(getUserName())
  // // 账户信息
  // dispatch(getAccountInfo())
  // console.log(res)
}

// 重置登录状态
export const resetInfo = (dispatch, getState) => _ => {
  // console.log(dispatch)
  // 重置
  const nList = resetUserState(getState().userList)
  // 更新用户信息
  dispatch(setUserListActions(nList))
  // 清理账户信息
  dispatch(clearAccountInfo)
  // 新列表缓存到本地
  setUsersCache(nList)
}
