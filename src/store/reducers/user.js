import { SET_USER_ITEM, SET_USER_LIST, DEL_USER_ITEM } from '../actions/Types'

export const userList = (state = [], action) => {
  // 声明
  const { userId, type, ...info } = action
  // 操作
  switch (type) {
    // 初始化
    case SET_USER_LIST:
      // 更新
      return info.list || []
    // 更新用户信息
    case SET_USER_ITEM:
      // 是否存在
      const cache = state.find(item => item.userId === userId)
      // 存在则更新
      return cache
        ? [{ ...cache, ...info }].concat(state.filter(item => item.userId !== userId))
        : [{ userId, ...info }].concat(state)
    // case SET_USER_ITEM:
    //   // 更新
    //   return updUserInfo(state, userId, info)
    // 删除某个
    case DEL_USER_ITEM:
      // 更新
      return state.filter(item => item.userId !== userId) || []
    default:
      return state
  }
}

// 当前登录用户信息
export const getUserInfo = state => {
  return state.find(item => item.online) || null
}
// 用户信息
export const getUserInfoById = (state, userId) => {
  return state.find(item => item.userId === userId) || null
}
// 用户信息
export const resetUserState = state => {
  return state.filter(item => item.userId).map(item => ({...item, online: false}))
}
