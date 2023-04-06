import { getGlobalData } from '../conf/tools'

const z = '#F22323'
const d = '#03A000'
const blue = '#3381E3'

export const getColors = val => {
  const { default: themeConf } = getGlobalData('Theme') === 'w' ? require(`./white.js`) : require(`./black.js`)
  const colors = Object.assign({
    z, d, blue,
    ...themeConf,
  })
  // 同时获取多个
  const ks = val.replace(/\s/g, '').split(',')
  // 一个
  if (ks.length === 1) {
    // 直接返回
    return colors[ks[0]]
  } else {
    // 声明
    const res = {}
    // 遍历
    ks.forEach(key => {
      res[key] = colors[key]
    })
    // 返回汇总对象
    return res
  }
  return colors[val]
}

export const getZdColor = val => Number(val) ? { color: val > 0 ? z : val < 0 ? d : undefined } : null
