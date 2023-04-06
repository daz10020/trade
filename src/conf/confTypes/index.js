'use strict'
import { futuresApp } from './modules'
export default {
  id: {
    required: true,
    type: [Number, String]
  },
  version:{
    required: true,
    type: Number
  },
  system_config: {

  },
  data_config: {
  },
  conf_futuresApp: futuresApp
}

