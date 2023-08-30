import { randint } from '../core/tools'
import { getQuestionByPath } from '../questions';

/**
 * 根据题目列表随机一道题
 * @param questionList 题目列表
 * @returns 题目
 */
export const randomOneQuestion = (
  questionList: Array<string | null>,
): string | null => {
  if (questionList.length == 0){
    return null;
  }
  const rand = randint(0, questionList.length - 1);
  return questionList[rand];
}

/**
 * 根据路径列表随机一道题
 * @param pathList 路径列表
 */
export const randomOneQuestionByPathList = (
  pathList: Array<Array<string | null>>,
): string | null => {
  var resList: Array<any> = []
  for (var i = 0, len = pathList.length; i < len; i++) {
    const qList = getQuestionByPath(pathList[i])
    resList = resList.concat(qList)
  }
  return randomOneQuestion(resList);
}

/**
 * 根据题目列表随机n道题
 * @param questionList 题目列表
 * @returns 题目
 */
export const randomQuestions = (
  questionList: Array<string | null>,
  num: number,
): Array<string | null> => {
  if (questionList.length == 0){
    return [];
  }
  if (num > questionList.length) {
    num = questionList.length;
  }
  if (num == 0) {
    num = questionList.length;
  }
  const resArray = [];
  for (var i = 0; i < num; i++) {
    const rand = randint(0, questionList.length - 1);

    resArray.push(questionList[rand]);
    questionList.splice(rand, 1)
  }
  return resArray;
}

/**
 * 根据路径列表随机一道题
 * @param pathList 路径列表
 */
export const randomQuestionsByPathList = (
  pathList: Array<Array<string | null>>,
  num: number,
): Array<string | null> => {
  var resList: Array<any> = []
  for (var i = 0, len = pathList.length; i < len; i++) {
    const qList = getQuestionByPath(pathList[i])
    resList = resList.concat(qList)
  }
  return randomQuestions(resList, num);
}
