/**
 * 判断对象里是否存在key
 * 解决 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 报错问题
 * https://blog.csdn.net/HRM2454/article/details/114685421
 * @param key 判断的key
 * @param object 判断的对象
 * @return 是否存在
 */
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

/**
 * js是否可使用css变量相关函数
 * @returns 是否可用
 */
export function isSupportedCssVariable(): boolean {
  return window.CSS && window.CSS.supports && window.CSS.supports('--a', '0')
}

/**
 * 在一定范围生成随机数
 * https://www.runoob.com/w3cnote/js-random.html
 * @param minNum 最小数
 * @param maxNum 最大数
 * @returns 生成的随机数
 */
export function randint(minNum: number, maxNum: number): number {
  switch (arguments.length) {
    case 1:
      return parseInt((Math.random() * minNum + 1).toString(), 10)
      break
    case 2:
      return parseInt(
        (Math.random() * (maxNum - minNum + 1) + minNum).toString(),
        10
      )
      break
    default:
      return 0
      break
  }
}
