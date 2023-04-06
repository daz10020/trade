'use strict'

const isBlank = stock => stock == null || stock == ''
const endsWith = (code, stock) => eval(`/${code}$/`).test(stock)
const startsWith = (code, stock) => eval(`/^${code}/`).test(stock)
/**
 * 服务器后缀: 上海股票ST 上海指数IN 上海权证SW 上海债券SB 上海基金SF 上海未知SU  深圳股票ST 深圳指数IN 深圳权证ZW 深圳债券ZB 深圳基金ZF 深圳未知ZU
 * 板块指数IN  港股股票HU 港股权证HW 港股债券HB 港股基金HF  外汇FF 外汇权证FW 外汇债券FB 外汇未知FU 人民币中间价FC 即时报价FX 人民币即时报价CF
 * 股指期货权证IW 股指期货债券IB 股指期货基金IF 股指期货未知IU
 * COMEX期货CM NYMEX期货NM COBOT期货CB SGX期货SX LME期货LM NYBOT期货NB MDEX期货BM TOCOM期货TO IPE期货IC
 * 国内期货权证QW 国内期货债券QB 国内期货基金QF 国内期货未知QU   SGE国内现货SG
 * NASDAQ美股股票NS AMEX美股股票AS NYSE美股股票YS
 * 国际指数OI
 * 上交所期权OP 上交所期权TJ  中金所期权CO
 * 恒生指数HI 中证海外ZZ 国际现货FS 香港贵金属HS 港股板块指数EZ
 * 美股板块 UB
 *
 * @param stock
 * @return
 */
export default stock => {

  let resultStock = ''
  // 空
  if (isBlank(stock)) return stock

  //上海指数IN  深圳指数IN  板块指数IN
  if (endsWith('IN', stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    if (startsWith('000', sCode)) {
      resultStock = 'SH' + sCode;
    } else if (startsWith('399', sCode) || startsWith('395', sCode)) {
      resultStock = 'SZ' + sCode;
    } else if (startsWith('BK', sCode)) {
      resultStock = sCode.replace('BK', 'BI');
    }
    return resultStock;
  }

  //上海股票ST 深圳股票ST
  if (endsWith("ST", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    if (sCode.length == 6) {
      if (startsWith("6", sCode) || startsWith("9", sCode)) {
        resultStock = "SH" + sCode;
      } else if (startsWith("00", sCode) || startsWith("30", sCode)
        || startsWith("20", sCode)
        || startsWith("40", sCode)
        || startsWith("42", sCode)
        || startsWith("43", sCode)
        || startsWith("83", sCode)
        || startsWith("87"), sCode) {
        resultStock = "SZ" + sCode;
      }
    }
    return resultStock;
  }


  //上交所期权
  if (endsWith("OP", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "SO" + sCode;
    return resultStock;
  }
  //中金所期权
  if (endsWith("CO", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "FO" + sCode;
    return resultStock;
  }
  //NASDAQ美股股票NS
  if (endsWith("NS", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "NASDAQ|" + sCode;
    return resultStock;
  }
  //
  if (endsWith("HO", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKUSDCNHOP|" + sCode;
    return resultStock;
  }
  //
  if (endsWith("CU", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "SHFEOPTION|" + sCode;
    return resultStock;
  }
  //
  if (endsWith("ZO", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "CZCEOPTION|" + sCode;
    return resultStock;
  }
  //
  if (endsWith("DO", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "DCEOPTION|" + sCode;
    return resultStock;
  }
  //AMEX美股股票AS
  if (endsWith("AS", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "AMEX|" + sCode;
    return resultStock;
  }
  //NYSE美股股票YS
  if (endsWith("YS", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "NYSE|" + sCode;
    return resultStock;
  }
  //COMEX期货
  if (endsWith("CM", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "COMEX|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("NM", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "NYMEX|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("CB", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "COBOT|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("SX", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "SGX|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("LM", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "LME|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("NB", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "NYBOT|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("BM", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "MDEX|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("TO", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "TOCOM|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("IC", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "IPE|" + sCode;
    return resultStock;
  }
  //兼容新外盘
  if (endsWith("SG", stock)) {
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "SGE|" + sCode;
    return resultStock;
  }

  //兼容新外盘
  if (endsWith("QU", stock)) {
    const sCode = stock.substring(0, stock.length - 2);

    if (sCode==="BELI") {//BFX,KLSE,JKSE,STI,KS11,SPX
      resultStock = "QQZS|BFX";
    } else if (sCode === "MGI") {
      resultStock = "QQZS|KLSE";
    } else if (sCode === "YNI") {
      resultStock = "QQZS|JKSE";
    } else if (sCode === "STI") {
      resultStock = "QQZS|STI";
    } else if (sCode === "NHI") {
      resultStock = "QQZS|KS11";
    } else if (sCode === "SP5I") {
      resultStock = "QQZS|SPX";
    } else if (sCode === "EMCOM") {
      resultStock = "EFI|EMCOM";
    } else if (sCode === "EMIND") {
      resultStock = "EFI|EMIND";
    } else if (sCode === "EMAGR") {
      resultStock = "EFI|EMAGR";
    } else if (sCode === "EMFIN") {
      resultStock = "EFI|EMFIN";
    } else if (endsWith("fi", sCode.toLowerCase())) {
      resultStock = "EFI|" + sCode;
    } else {
      const  __lowCode = sCode.toLowerCase();
      if (startsWith("cu", __lowCode) ||
        startsWith("zn", __lowCode) ||
        startsWith("al", __lowCode) ||
        startsWith("pb", __lowCode) ||
        startsWith("au", __lowCode) ||
        startsWith("ag", __lowCode) ||
        startsWith("rb", __lowCode) ||
        startsWith("wr", __lowCode) ||
        startsWith("fu", __lowCode) ||
        startsWith("ru", __lowCode) ||
        startsWith("bu", __lowCode) ||
        startsWith("ni", __lowCode) ||
        startsWith("hc", __lowCode) ||
        startsWith("sn", __lowCode) ||
        startsWith("sp", __lowCode) ||
        startsWith("nr", __lowCode) ||
        startsWith("ss", __lowCode)) {//一定要先判断上期所和郑商所cu\zn\al\pb\au\ag\rb\wr\fu\ru\bu\hc
        resultStock = "SHFE|" + sCode;
      } else if (startsWith("wh", __lowCode) ||
        (startsWith("pm", __lowCode) && !__lowCode === "pm") ||  //需要排除 DCE|pm棕榈油主力
        startsWith("cf", __lowCode) ||
        startsWith("sr", __lowCode) ||
        startsWith("ta", __lowCode) ||
        startsWith("oi", __lowCode) ||
        startsWith("ri", __lowCode) ||
        startsWith("me", __lowCode) ||
        startsWith("fg", __lowCode) ||
        startsWith("rs", __lowCode) ||
        startsWith("rm", __lowCode) ||
        startsWith("jr", __lowCode) ||
        startsWith("tc", __lowCode) ||
        startsWith("lr", __lowCode) ||
        startsWith("sf", __lowCode) ||
        startsWith("sm", __lowCode) ||
        startsWith("zc", __lowCode) ||
        startsWith("ma", __lowCode) ||
        startsWith("ap", __lowCode) ||
        startsWith("cy", __lowCode) ||
        startsWith("cj", __lowCode) ||
        startsWith("ur", __lowCode) ||
        startsWith("sa", __lowCode)) {//一定要先判断上期所和郑商所wh\pm\cf\sr\ta\oi\ri\me\fg\rs\rm\jr\tc\lr\sf\sm
        resultStock = "CZCE|" + sCode;
      } else if (startsWith("ci", __lowCode) ||
        startsWith("si", __lowCode)) {//c\a\b\m\y\p\l\v\j\jm\fb\i\bb\jd\pp
        resultStock = "GFEX|" + sCode;
      } else if (startsWith("c", __lowCode) ||
        startsWith("a", __lowCode) ||
        startsWith("b", __lowCode) ||
        startsWith("m", __lowCode) ||
        startsWith("y", __lowCode) ||
        startsWith("p", __lowCode) ||
        startsWith("l", __lowCode) ||
        startsWith("v", __lowCode) ||
        startsWith("jm", __lowCode) ||
        startsWith("fb", __lowCode) ||
        startsWith("i", __lowCode) ||
        startsWith("bb", __lowCode) ||
        startsWith("jd", __lowCode) ||
        startsWith("pp", __lowCode) ||
        startsWith("eg", __lowCode) ||
        startsWith("rr", __lowCode) ||
        startsWith("eb", __lowCode) ||
        startsWith("pg", __lowCode)) {//c\a\b\m\y\p\l\v\j\jm\fb\i\bb\jd\pp
        resultStock = "DCE|" + sCode;
      }
    }
    return resultStock;
  }


  if (endsWith("OI", stock)) {//兼容新外盘
    const sCode = stock.substring(0, stock.length - 2);
    if (sCode === "BELI") {//BFX,KLSE,JKSE,STI,KS11,SPX
      resultStock = "QQZS|BFX";
    } else if (sCode === "MGI") {
      resultStock = "QQZS|KLSE";
    } else if (sCode === "YNI") {
      resultStock = "QQZS|JKSE";
    } else if (sCode === "YNI") {
      resultStock = "QQZS|STI";
    } else if (sCode === "NHI") {
      resultStock = "QQZS|KS11";
    } else if (sCode === "SP5I") {
      resultStock = "QQZS|SPX";
    } else {
      resultStock = "QQZS|" + sCode;
    }
    return resultStock;
  }

  if (endsWith("FX", stock)) {//外汇
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "FOREX|" + sCode;
    return resultStock;
  }
  if (endsWith("FC", stock)) {//人民币汇率
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "CNYRATE|" + sCode;
    return resultStock;
  }
  if (endsWith("FS", stock)) {//国际现货
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "FORPM|" + sCode;
    return resultStock;
  }
  if (endsWith("HS", stock)) {//香港贵金属
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKPM|" + sCode;
    return resultStock;
  }
  if (endsWith("CF", stock)) { //人民币询价
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "CNYFOREX|" + sCode;
    return resultStock;
  }
  if (endsWith("OA", stock)) {//离岸人民币
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "CNYOFFS|" + sCode;
    return resultStock;
  }
  if (endsWith("ZZ", stock)) {//中华交易指数
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKIN|" + sCode;
    return resultStock;
  }
  if (endsWith("HI", stock)) {//深港通 恒生指数
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HS|" + sCode;
    return resultStock;
  }
  if (endsWith("EZ", stock)) {//香港板块
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKBLOCK|" + sCode;
    return resultStock;
  }
  if (endsWith("OB", stock)) { //香港指数期货
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKINDEXF|" + sCode;
    return resultStock;
  }
  if (endsWith("HA", stock)) {//香港股票期货
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKSTOCKF|" + sCode;
    return resultStock;
  }
  if (endsWith("HD", stock)) {//香港商品期货
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKMETALFS|" + sCode;
    return resultStock;
  }
  if (endsWith("HC", stock)) {//香港外汇期货
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "HKCNYF|" + sCode;
    return resultStock;
  }
  if (endsWith("SE", stock)) {//能源交易中心
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "INE|" + sCode;
    return resultStock;
  }
  if (endsWith("UB", stock)) {//美股板块
    const sCode = stock.substring(0, stock.length - 2);
    resultStock = "USBLOCK|" + sCode;
    return resultStock;
  }
  //以上条件都不满足 else
  const sCode = stock.substring(0, stock.length - 1);
  if (endsWith("S", stock)) {
    resultStock = "SH" + sCode;
  } else if (endsWith("Z", stock)) {
    resultStock = "SZ" + sCode;
  } else if (endsWith("H", stock)) {
    resultStock = "HK|" + sCode;
  } else if (endsWith("Q", stock)) {
    resultStock = "QQZS|" + sCode;
  } else if (endsWith("I", stock)) {
    resultStock = "SF" + sCode;
  }
  if (!isBlank(resultStock)) {
    resultStock = resultStock.substring(0, resultStock.length - 1);
  }

  if (isBlank(resultStock)) { //如果不符合任何替换规则，返回原代码
    return stock;
  }

  return resultStock;
}
