import quesData from "../data/index.json";
import { isValidKey } from './tools'

/**
 * 问题对象
 */
export let question = quesData.data;
// export let question = {};

/**
 * 备注
 */
export let note = quesData.note;
// export let note = "暂无";

/**
 * 根据传入题目对象返回题目列表
 * @param questionObj 问题对象，类似于questionObj对象
 * @return 题目列表
 */
export const getQuestionByQuesObj = (questionObj: object): Array<string> => {
  let resArray: any = []
  for (const [_, value] of Object.entries(questionObj)) {
    if (Array.isArray(value)) {
      resArray = resArray.concat(value)
    } else {
      const qList = getQuestionByQuesObj(value)
      resArray = resArray.concat(qList)
    }
  }
  return resArray
}

/**
 * 根据路径返回题目列表
 * @param pathList 问题路径列表 ['八下', '第二单元', '第四课']
 * @return 题目列表
 */
export const getQuestionByPath = (
  pathList: Array<string | null>
): Array<string | null> | null => {
  var res = question
  for (var i = 0, len = pathList.length; i < len; i++) {
    const key = pathList[i]
    if (key) {
      if (!isValidKey(key, res)) {
        return null
      }
      res = res[key] 
    }
  }
  // 是题目数组直接返回
  if (Array.isArray(res)) {
    return res
  }
  // 不是题目数组
  return getQuestionByQuesObj(res)
}
export const getQuestionByPathList = (
  pathList: Array<Array<string | null>>
): Array<string | null> | null => {
  var resList: Array<any> = []
  for (var i = 0, len = pathList.length; i < len; i++) {
    const qList = getQuestionByPath(pathList[i])
    resList = resList.concat(qList)
  }
  return resList
};

/**
 * 获取全部题目
 * @return 全部题目列表
 */
export const getAllQuestion = (): Array<string | null> => {
  const qRes = getQuestionByPath([]);
  if (!qRes){
    return [];
  }
  return qRes;
}

/**
 * 判断路径是否存在
 * @param pathList 路径
 * @returns 是否存在
 */
export const isQuestionPathExist = (path: Array<string | null>): boolean => {
  var res = question
  for (var i = 0, len = path.length; i < len; i++) {
    const key = path[i]
    if (key) {
      if (!isValidKey(key, res)) {
        return false
      }
      res = res[key] 
    }
  }
  return true;
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
