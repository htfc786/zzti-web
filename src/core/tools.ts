
/**
 * 判断对象里是否存在key
 * 解决 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 报错问题
 * https://blog.csdn.net/HRM2454/article/details/114685421
 * @param key 判断的key
 * @param object 判断的对象
 * @return 是否存在
 */
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}
