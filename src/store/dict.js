export const MaxOrderRef = 10;//报单引用静态自增

// export const CTP_RESPONSE_CODE_2 = -2;//未处理超过数量
// export const CTP_RESPONSE_CODE_3 = -3;//每秒请求超上限
// export const CTP_RESPONSE_CODE_203 = -203;//未登陆
// export const CTP_RESPONSE_CODE_215 = -215;//非交易时间
//
// export const CTP_RESPONSE_CODE_28 = 28;//无报单交易权限
// export const CTP_RESPONSE_CODE_20 = 20;//未在交易所开户
// export const CTP_RESPONSE_CODE_42 = 42;//结算单未确认

// export const NETTY_EVENT_RELOGIN = -1;
// export const NETTY_EVENT_LOGIN_TIMEOUT = -10001;
// export const NETTY_EVENT_LOGIN_TIMEOUT_HINTS = "登录已超时，请检查网络状况";
//
// export const NETTY_EVENT_30009 = -30009;//资金信息变动event
// export const NETTY_EVENT_30001 = -30001;//报单数据event
// export const NETTY_EVENT_30014 = -30014;
// export const NETTY_EVENT_HEART = -14;//0xE
// export const NETTY_EVENT_PUSH_TOTAL = -40000;
// export const NETTY_EVENT_PUSH_40001 = -40001;
// export const NETTY_EVENT_PUSH_40002 = -40002;
//    export const NETTY_EVENT_30014_2 = -300142;//显示持仓列表某个item的选中状态，即点击后出现平仓、锁仓、行情的布局
//    export const NETTY_EVENT_30014_3 = -300143;//重置持仓列表FuturesTabMyHoldingFragment各个item的选中状态


///TFtdcOrderSubmitStatusType是一个报单提交状态类型
///已经提交
export const THOST_FTDC_OSS_InsertSubmitted = 48;
///撤单已经提交
export const THOST_FTDC_OSS_CancelSubmitted = 49;
///修改已经提交
export const THOST_FTDC_OSS_ModifySubmitted = 50;
///已经接受
export const THOST_FTDC_OSS_Accepted = 51;
///报单已经被拒绝
export const THOST_FTDC_OSS_InsertRejected = 52;
///撤单已经被拒绝
export const THOST_FTDC_OSS_CancelRejected = 53;
///改单已经被拒绝
export const THOST_FTDC_OSS_ModifyRejected = 54;

// 报单提交状态类型
export const TFtdcOrderSubmitStatusType = {
  THOST_FTDC_OSS_InsertSubmitted,
  THOST_FTDC_OSS_CancelSubmitted,
  THOST_FTDC_OSS_ModifySubmitted,
  THOST_FTDC_OSS_Accepted,
  THOST_FTDC_OSS_InsertRejected,
  THOST_FTDC_OSS_CancelRejected,
  THOST_FTDC_OSS_ModifyRejected
}

///TFtdcOrderStatusType是一个报单状态类型
///全部成交
export const THOST_FTDC_OST_AllTraded = 48;
///部分成交还在队列中
export const THOST_FTDC_OST_PartTradedQueueing = 49;
///部分成交不在队列中
export const THOST_FTDC_OST_PartTradedNotQueueing = 50;
///未成交还在队列中
export const THOST_FTDC_OST_NoTradeQueueing = 51;
///未成交不在队列中
export const THOST_FTDC_OST_NoTradeNotQueueing = 52;
///撤单
export const THOST_FTDC_OST_Canceled = 53;
///未知
export const THOST_FTDC_OST_Unknown = 97;
///尚未触发
export const THOST_FTDC_OST_NotTouched = 98;
///已触发
export const THOST_FTDC_OST_Touched = 99;
// 报单状态类型
export const TFtdcOrderStatusType = {
  THOST_FTDC_OST_AllTraded,
  THOST_FTDC_OST_PartTradedQueueing,
  THOST_FTDC_OST_PartTradedNotQueueing,
  THOST_FTDC_OST_NoTradeQueueing,
  THOST_FTDC_OST_NoTradeNotQueueing,
  THOST_FTDC_OST_Canceled,
  THOST_FTDC_OST_Unknown,
  THOST_FTDC_OST_NotTouched,
  THOST_FTDC_OST_Touched
}


// 平今
export const ORDER_COMB_OFFSET_FLAG_CLOSE_TODAY = 3
// 平仓
export const ORDER_COMB_OFFSET_FLAG_CLOSE = 1
// 委托单常量
export const DIRECTION_TYPE = ['买', '卖']

export const OFFSET_TYPE = ['开仓', '平仓', '强平', '平今', '平昨', '强减', '本地强平']

export const STATUS_TYPE = {
  [THOST_FTDC_OST_AllTraded]: '全成',
  [THOST_FTDC_OST_PartTradedQueueing]: '部分成交',
  [THOST_FTDC_OST_PartTradedNotQueueing]: '部分成交',
  [THOST_FTDC_OST_NoTradeQueueing]: '未成交',
  [THOST_FTDC_OST_NoTradeNotQueueing]: '未成交',
  [THOST_FTDC_OST_Canceled]: '撤单',
  [THOST_FTDC_OST_Unknown]: '未知',
  [THOST_FTDC_OST_NotTouched]: '未触发',
  [THOST_FTDC_OST_Touched]: '已触发',
}

export const CAN_REVOKE_TYPE = [49, 50, 51, 52, 98]
