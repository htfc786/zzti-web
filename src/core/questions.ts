import { reactive, VueElement, h } from 'vue'
import type { ItemType } from 'ant-design-vue'
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import { isQuestionPathExist } from '../questions'
import questionObj from '../questions/questions'

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
  const menuItems = getMenuItems(questionObj)
  return reactive(menuItems)
}

/**
 * 通过Menu的key列表生成路径
 * @param keyPath Menu的key列表
 * @returns 路径列表
 */
export const getPathByMenuKey = (keyPath: Array<any>): Array<string> => {
  const resList = []
  for (var i = 0, len = keyPath.length; i < len; i++) {
    resList.push(keyPath[i].split('\\').shift())
  }
  return resList
}

/**
 * 通过路径反查Menu key
 * @param path 路径
 * @param MenuObj Menu对象
 * @returns Menu key
 */
export const getMenuKeyByPath = (
  path: Array<string | null>,
  MenuObj: Array<any>
): Array<string> => {
  var res = MenuObj;
  var res_key: any = '';
  for (var i = 0, len = path.length; i < len; i++) {
    const key = path[i]
    for (var j = 0, lenj = res.length; j < lenj; j++) {
      if (res && !res[j]) { continue; }
      if (res[j]?.label==key) {
        res_key = res[j]?.key;
        res = res[j]?.children;
        break;
      }
    }
  }
  return [res_key];
}

/**
 * getTreeData 通过题目列表生成a-tree-select组件列表数据
 */
export const getTreeData = (list: Object, lastKey: string | null = null) => {
  const resArray = []
  if (!lastKey) {
    lastKey = ''
  } else {
    lastKey = lastKey + '\\'
  }
  for (const [key, value] of Object.entries(list)) {
    const itemKeyStr: string = lastKey + key
    if (!Array.isArray(value)) {
      const qData: any = getTreeData(value, itemKeyStr)
      resArray.push({
        label: key,
        value: itemKeyStr,
        children: qData,
      })
    } else {
      resArray.push({
        label: key,
        value: itemKeyStr,
      })
    }
  }
  return resArray
}

/**
 * 获取菜单对象
 * @return MenuObj
 */
export const getTreeDataByQues = () => {
  return [
    {
      label: '全部题目',
      value: '\\',
      children: getTreeData(questionObj),
    },
  ]
}

/**
 * 通过a-tree-select组件值获取path路径
 * @param treeValue a-tree-select组件值
 * @returns path路径
 */
export const getPathByTreeValue = (treeValue: string): Array<string> => {
  if (treeValue == '\\') {
    return []
  }
  return treeValue.split('\\')
}

/**
 * 通过a-tree-select组件列表值获取path路径列表
 * @param treeValueList a-tree-select组件值列表
 * @returns path路径列表
 */
export const getPathListByTreeValueList = (
  treeValueList: Array<string>
): Array<Array<string>> => {
  const resList = []
  for (var i = 0, len = treeValueList.length; i < len; i++) {
    resList.push(getPathByTreeValue(treeValueList[i]))
  }
  return resList
}

/**
 * 通过path路径获取a-tree-select组件值
 * @param path path路径
 * @returns a-tree-select组件值
 */
export const getTreeValueByPath = (path: Array<string | null>): string => {
  if (path.length == 0) {
    return "\\";
  }
  return path.join('\\')
}

/**
 * 通过path路径列表获取a-tree-select组件列表值
 * @param pathList path路径列表
 * @returns a-tree-select组件值列表
 */
export const getTreeValueListByPathList = (
  pathList: Array<Array<string | null>>
): Array<string> => {
  const resList = []
  for (var i = 0, len = pathList.length; i < len; i++) {
    resList.push(getTreeValueByPath(pathList[i]))
  }
  return resList
}

interface checkPathListReturn {
  pathList: Array<Array<string | null>>;
  error: boolean;
  del?: Array<string>
}
/**
 * 检查pathList中的值是否存在，把不存在的值删掉
 * @param pathList path路径列表
 * @returns
 */
export const checkPathList = (
  pathList: Array<Array<string | null>>
): checkPathListReturn => {
  var noRes = []
  var noVal = []
  for (var i = 0, len = pathList.length; i < len; i++) {
    if (!isQuestionPathExist(pathList[i])) {
      noRes.push(pathList[i].join("\\"))
      noVal.push(pathList[i]);//splice
    }
  }
  var res = pathList
  for (var i = 0, len = noVal.length; i < len; i++) {
    res.splice(res.indexOf(noVal[i]), 1)
  }
  
  if (noRes.length == 0) {
    return { pathList: res, error: false }
  }
  return { pathList: res, error: true, del: noRes }
}
