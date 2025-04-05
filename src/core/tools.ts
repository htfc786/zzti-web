import { VueElement } from 'vue'
import type { ItemType } from 'ant-design-vue'
/**
 * 判断对象里是否存在key
 * 解决 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 报错问题
 * https://blog.csdn.net/HRM2454/article/details/114685421
 * @param key 判断的key
 * @param object 判断的对象
 * @return 是否存在
 */
export function isValidKey(
  key: any,
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

/**
 * 用于创建menu一个对象
 * @param label 标题
 * @param key key
 * @param icon 图标
 * @param children 子项
 * @param type 类型 group组型
 * @return 创建的menu对象
 */
export const getMenuItem = (
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group'
): ItemType => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType
}