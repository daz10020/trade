// import Crypto from 'react-native-crypto'
// import rsa from 'jsencrypt'
// const RSAcrypt = new rsa()
// import { Alert } from 'react-native'
//
// const { pbkdf2Sync, createCipheriv, createDecipheriv, publicEncrypt } = Crypto
//
// // 更改填充
// export const RSA = {
//   // 加密
//   encrypt: (str, publicKey = '') => {
//     let ks = [...publicKey]
//     for (let i = 64; i < publicKey.length; i += 65) {
//       publicKey[i] === ' ' ? (ks[i] = `\n`) : ks.splice(i, 0, `\n`)
//     }
//     const public_key = `-----BEGIN PUBLIC KEY-----\n${ks.join('')}\n-----END PUBLIC KEY-----\n`
//     RSAcrypt.setPublicKey(public_key)
//     // 加密
//     return RSAcrypt.encrypt(str)
//     // 加密
//     // return publicEncrypt(public_key, new Buffer.from(str, 'ascii'))
//   },
//   // 使用 私钥 解密
//   decrypt: (str, privateKey) => {
//     // // 私钥
//     // RSAcrypt.setPrivateString(privateKey)
//     // // 解密
//     // return RSAcrypt.decrypt(str)
//   }
// }
// // 声明
// export const pbkdf_sha256 = (pwd, salt, iterations, keySize) => pbkdf2Sync(pwd, salt, iterations, keySize, 'sha256')
// // 声明
// export const AES = {
//   // 加密
//   encrypt: (word, key, iv) => {
//     // 创建
//     const encipher = createCipheriv('aes-256-cbc', key, iv)
//     console.log('new Buffer(word)')
//     // 加密
//     return new Buffer(encipher.update(new Buffer(word)) + encipher.final(), 'binary')
//   },
//   // 解密
//   decrypt: (content, key, iv) => {
//     // 创建
//     const decipher  = createDecipheriv('aes-256-cbc', key, iv)
//     // 加密
//     return decipher.update(content) + decipher.final()
//   }
// }
//
