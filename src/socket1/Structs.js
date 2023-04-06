
const header = [
  { key: 'headflag', len: 1, type: 'Uint8' },
  { key: 'srvtype', len: 1, type: 'Uint8' },
  { key: 'major', len: 1, type: 'Uint8' },
  { key: 'packType', len: 1, type: 'Uint8' },
  { key: 'packid', len: 33, type: 'Int32' },
  { key: 'slen', len: 4, type: 'Int32' },
  { key: 'len', len: 4, type: 'Int32' },
  { key: 'headcrc', len: 4, type: 'Int32' },
  { key: 'cipher', len: 1, type: 'Uint8' },
  { key: 'compress', len: 1, type: 'Uint8' },
  { key: 'content', len: 0, type: 'buffer' }
]

const base = [
  { key: 'sessid', len: 33, type: 'Int32' },
  { key: 'datalen', len: 4, type: 'Int32' },
  { key: 'data', len: 0, type: 'string' }
]

const res96 = [
  { key: 'cipher_len', len: 4, type: 'Int32' },
  { key: 'ip', len: 20, type: 'string' },
  { key: 'port', len: 4, type: 'Int32' },
  { key: 'cipher_data', len: 0, type: 'string' }
]

const req97 = [
  { key: 'cipher_len', len: 4, type: 'Int32' },
  { key: 'ip', len: 20, type: 'string' },
  { key: 'port', len: 4, type: 'Int32' },
  { key: 'cipher_data', len: 0, type: 'buffer' }
]

const res97 = [
  { key: 'cipher_len', len: 4, type: 'Int32' },
  { key: 'ip', len: 20, type: 'string' },
  { key: 'port', len: 4, type: 'Int32' },
  { key: 'cipher_data', len: 0, type: 'Int32' }
]

export default {
  header, req97, base, res96, res97
}
