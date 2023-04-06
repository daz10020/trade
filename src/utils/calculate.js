// JS浮点数运算重置
/**
 * 加法函数
 * @param arg1
 * @param arg2
 * @returns {number} arg1加上arg2的精确结果
 */
export const accAdd = (arg1, arg2) => {
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

/**
 * 减法函数
 * @param arg1
 * @param arg2
 * @returns {number} arg1减上arg2的精确结果
 */
export const accSub = (arg1, arg2) => {
  let r1, r2
  try {
    r1 = arg2.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg1.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  const n = (r1 >= r2) ? r1 : r2
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
}

/**
 * 乘法函数
 * @param arg1
 * @param arg2
 * @returns {number} arg1乘以arg2的精确结果
 */
export const accMul = (arg1, arg2) => {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 * 除法函数
 * @param arg1
 * @param arg2
 * @returns {number} arg1除以arg2的精确结果
 */
export const accDiv = (arg1, arg2) => {
  let t1, t2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
    t1 = 0
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
    t2 = 0
  }
  const r1 = Number(arg1.toString().replace('.', ''))
  const r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

