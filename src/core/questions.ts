import { reactive, VueElement, h } from 'vue'
import type { ItemType } from 'ant-design-vue'
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import questionList from '../questions/questionList'

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

let itemsKey: number = 0
/**
 * getMenuItems 通过题目列表生成一组menu对象
 */
export const getMenuItems = (list: Object) => {
  const resArray = []
  for (const [key, value] of Object.entries(list)) {
    itemsKey++
    const itemKeyStr: string = key + '\\' + itemsKey
    if (!Array.isArray(value)) {
      const qObj: any = getMenuItems(value)
      resArray.push(
        getMenuItem(key, itemKeyStr, () => h(FolderOpenOutlined), qObj)
      )
    } else {
      resArray.push(getMenuItem(key, itemKeyStr, () => h(FileOutlined)))
    }
  }
  return resArray
}

/**
 * 获取右侧菜单对象
 * @return MenuObj
 */
export const getMenuObj = () => {
  const menuItems = getMenuItems(questionList)
  return reactive(menuItems)
}

export const getPath = (keyPath: Array<any>): Array<string> => {
  const resList = []
  for (var i = 0, len = keyPath.length; i < len; i++) {
    resList.push(keyPath[i].split('\\').shift())
  }
  return resList
}
