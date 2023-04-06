import CryptoJS from 'crypto-js'
import rsa from 'jsencrypt'

export class RSACls {

  constructor(options) {
    // JSEncrypt对象
    this.RSAcrypt = new rsa()
    // // 配置
    // const { randomStr } = options
    // // 创建
    // Object.assign(this, {
    //   // 加密对象
    //   RSAcrypt: new rsa()
    // })
    return this
  }

  // 加密
  encrypt = (str , publicKey = '') => {
    // 声明
    const { RSAcrypt } = this
    // 初始
    let ks = [...publicKey]
    // 遍历
    for (let i = 64; i < publicKey.length; i += 65) {
      publicKey[i] === ' ' ? (ks[i] = `\n`) : ks.splice(i, 0, `\n`)
    }
    // 公钥
    RSAcrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----\n${ks.join('')}\n-----END PUBLIC KEY-----\n`)
    // 加密
    return RSAcrypt.encrypt(str)
  }
  // 使用 私钥 解密
  decrypt = (str, privateKey) => {
    // 声明
    const { RSAcrypt } = this
    // 私钥
    RSAcrypt.setPrivateKey(privateKey)
    // 解密
    return RSAcrypt.decrypt(str)
  }
}

// 声明
const { enc: { Hex }, algo: { SHA256 }, PBKDF2, AES: { encrypt, decrypt }, mode: { CBC }, pad: { Pkcs7 }, lib: { CipherParams } } = CryptoJS

export class AESCls {

  constructor(options) {
    // 声明
    const {pbkdf_sha256, encrypt, decrypt} = this
    // 配置
    const { salt, randomStr } = options
    // 派生
    const code = pbkdf_sha256(randomStr, salt, {
      keySize: 48 / 4,
      iterations: 2048,
    })

    Object.assign(this, {
      // 截取
      key: code.substr(0, 64),
      iv: code.substr(64)
    })
    // return {
    //   aesEn: json => encrypt(json, key, iv),
    //   aesDe: content => decrypt(content, key, iv),
    // }
    return { aesEn: encrypt, aesDe: decrypt }
  }
  // 派生
  pbkdf_sha256 = (str, salt, opt) => Hex.stringify(PBKDF2(str, salt, {
    ...opt,
    hasher: SHA256
  }))

  // 加密
  encrypt = word => {
    // 声明
    const { key, iv } = this
    // 返回
    return Hex.stringify(encrypt(Hex.parse(word), Hex.parse(key), {
      iv: Hex.parse(iv),
      mode: CBC,
      padding: Pkcs7
    }).ciphertext)
  }
  // 解密
  decrypt = content => {
    // 声明
    const { key, iv } = this
    // 返回
    return Hex.stringify(decrypt(CipherParams.create({
      ciphertext: Hex.parse(content)
    }), Hex.parse(key), {
      iv: Hex.parse(iv),
      mode: CBC,
      padding: Pkcs7
    }))
  }
}

