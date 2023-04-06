import { logError } from './tools'

// 验证规则
export const VALIDATE_REGS = {
  /* 不可为空（不可为undefined，null） */
  notNull: /^[\s\S]*.*[^\s][\s\S]*$/,
  /* 必填(字符串) */
  req: /^[\s\S]*.*[^\s][\s\S]*$/,
  /* url */
  url: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
  /* 手机号 */
  phone: /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|16[56]|17[0135678]|18[0-9]|19[0-9])[0-9]{8}$/
}

// 验证form的值
export const propsTypeValidator = (item, Setting) => {
  try {
    if (typeof Setting !== 'object') return true
    const resData = { ...item }
    Object.keys(Setting).forEach(key => {
      let { [key]: propVal } = item
      const { [key]: propSetting } = Setting

      if (propVal && Object.prototype.toString.call(propSetting) !== '[object Object]') {
        return contrastType(key, propVal, propSetting)
      }
      const { required, default: def, validator, type, children } = propSetting

      const absent = Object.prototype.hasOwnProperty.call(item, key)

      if (required && !absent) {
        throw new Error(`Missing required prop:"${key}`)
      }

      if (!absent && Object.prototype.hasOwnProperty.call(propSetting, 'default')) {
        propVal = def
      }

      if (required && (propVal === null || propVal === '' || propVal === undefined)) {
        throw new Error(`Invalid prop: null for required prop "${key}".`)
      }

      if (type && propVal) {
        contrastType(key, propVal, type)
      }

      if (validator && propVal && !validator(propVal)) {
        throw new Error(`Invalid prop: custom validator check failed for prop "${key}".`)
      }

      if (propVal && children) {
        if (Array.isArray(propVal)
          ? propVal.some(i => !propsTypeValidator(i, children))
          : !propsTypeValidator(propVal, children)) {
          throw new Error(`Invalid prop: custom validator check failed for prop "${key}".`)
        }
      }

      resData[key] = propVal
    })
    return resData
  } catch (e) {
    logError('validate', e)
    return false
  }
}

export const contrastType = (key, val, type) => {
  let valid = !type || type === true
  const expectedTypes = []

  if (type) {
    if (!Array.isArray(type)) {
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const { expectedType, valid: vRes } = assertType(val, type[i])
      expectedTypes.push(expectedType || '')
      valid = vRes
    }
  }

  if (!valid) {
    throw new Error(`
        Invalid prop: type check failed for prop "${key}".
        Expected ${expectedTypes.join(', ')}
      `)
  }
}

// 验证类型
export const assertType = (value, type) => {
  let valid
  const expectedType = getType(type)
  if ('String|Number|Boolean|Function'.indexOf(expectedType) !== -1) {
    valid = typeof value === (expectedType.toLowerCase())
  } else if (expectedType === 'Object') {
    valid = Object.prototype.toString.call(value) === '[object Object]'
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}

// 获取构造函数类型
export const getType = fn => {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match && match[1]
}
