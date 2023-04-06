import { getGlobalData } from '../conf/tools'

// 全部图片
const Images = {
  arrow_b: require('./arrow_b.png'),
  logo: require('./logo.png'),
  empty: require('./empty.png'),
  icon0: require('./icon0.png'),
  icon1: require('./icon1.png'),
  icon2: require('./icon2.png'),
  icon3: require('./icon3.png'),
  hrArrow: require('./hrArrow.png'),
  zjbf: require('./zjbf.png'),
  funds: require('./icon-funds.png'),
  transfer: require('./icon-transfer.png'),
  pwd: require('./icon-pwd.png'),
  user: require('./icon-user.png')
}

const themeImages = {
  arrow_w: require('./arrow_w.png'),
  arrow_b: require('./arrow_b.png'),
  arrow_circle_w: require('./arrow_circle_w.png'),
  arrow_circle_b: require('./arrow_circle_b.png'),
  tel_w: require('./tel_w.png'),
  tel_b: require('./tel_b.png'),
  safe_w: require('./safe_w.png'),
  safe_b: require('./safe_b.png'),
  question_w: require('./question_w.png'),
  question_b: require('./question_b.png'),
  cls_w: require('./cls_w.png'),
  cls_b: require('./cls_b.png'),
  g_w: require('./g_w.png'),
  g_b: require('./g_b.png'),
  search_w: require('./search_w.png'),
  search_b: require('./search_b.png'),
  search_btn_w: require('./search_btn_w.png'),
  search_btn_b: require('./search_btn_b.png'),
  sum_w: require('./sum_w.png'),
  sum_b: require('./sum_b.png'),
  gear_w: require('./gear_w.png'),
  gear_b: require('./gear_b.png'),
  radio_w: require('./radio_w.png'),
  radio_b: require('./radio_b.png'),
  radio_check_w: require('./radio_check_w.png'),
  radio_check_b: require('./radio_check_b.png'),
  popup_cls_b: require('./popup_cls_b.png'),
  popup_cls_w: require('./popup_cls_w.png'),
}

const themeKeys = ['arrow', 'tel', 'safe', 'question']

export const getImgs = _ => {

  // 主题
  const theme = getGlobalData('Theme') === 'w' ? 'w' : 'b'

  const res = { ...Images }

  themeKeys.forEach(i => res[i] = themeImages[`${i}_${theme}`])

  return res
}

export const getSingleImg = name => {
  // 有图直接返回
  if (Images[name]) return Images[name]
  // 主题
  const theme = getGlobalData('Theme') === 'w' ? 'w' : 'b'
  // 返回
  return themeImages[`${name}_${theme}`]
}

