// 文言实词解析工具
interface IPosition {
  start: number,
  end: number
}
interface Tongjia {
  is: boolean,
  origin?: string
}
export interface IWord {
  word: string,
  content: string,
  sentence: string,
  position: IPosition[],
  tongjia: Tongjia
} 

// 分离文章和和注释
function splitArticleAndComments(text: string) {
  // 分离注释，以字母开头，的开始为注释
  // 找到第一个换行+字母开头
  const splitText = /\n[a-zA-Z]/g.exec(text);
  if (!splitText) {
    return { article: text, comments: [] }
  }
  const splitRes = text.split(splitText[0])
  // 文章
  const articlesText = splitRes[0]
  const article = articlesText.split('\n').join("")
  // 注释
  // 合并剩下的
  const commentsText = splitRes.slice(1).join(splitText[0])
  const comments = (splitText + commentsText).split('\n')
  comments.shift()
  // 向上合并开头不是字母的注释
  for (let i = 0; i < comments.length; i++) {
    // 不是 a-zA-Z @(数字) #(数字)
    if (!/^[a-zA-Z@#\d]/.test(comments[i])) {
      comments[i-1] += comments[i]
      comments.splice(i,1)
      i--
    }
  }
  return { article, comments }
}

// 分离注释内容
function splitComment(comment: string) {
  // 开头标志 在 〔 之前
  const [ flag, nextText ] = comment.split('﹝')
  if (!nextText) {
    // 特殊注释 （一号注释）
    // 空格分隔
    const [ flag, content ] = comment.split(' ')
    // 内容
    return { flag, word:'', content, special: true }
  }
  // 注释和注释内容
  const [ word, content ] = nextText.split('〕')
  return { flag, word, content, special: false }
}

// 寻找指定位置向前或向后的标点
function findPunctuation(article: string, index: number, direction:'forward'|'backward'='forward') {
  // 标点
  const Punctuation = ["。","，","！","？","；","：","…","—","～","”","“","’","‘","【","】","《","》"]
  // 向前
  if (direction === 'forward') {
    for (let i = index; i < article.length; i++) {
      if (Punctuation.includes(article[i])) {
        return i
      }
    }
  } 
  // 向后
  if (direction === 'backward') {
    for (let i = index; i >= 0; i--) {
      if (Punctuation.includes(article[i])) {
        return i
      }
    }
  }
  // 没有找到
  return -1
}

// 获取短句
function getShortSentence(article: string, flag: string, word: string, pos=0) {
  // 找到文章中对应的文章位置
  // 可能有多个同名
  const index = article.indexOf(flag, pos)
  if (index === -1) {
    return null;
  }
  // 从flag开始，向前向后找句子开始和结尾
  let start = index;
  let end = findPunctuation(article, index, 'forward')
  if (end === -1) { end = article.length - 1 }
  // 截取句子
  let sentence = "";
  while (sentence.length < 4 || sentence.length < word.length || !sentence.includes(word[0])) {
    start = findPunctuation(article, start, 'backward') + 1 // +1 是去掉上一个标点
    if (start === -1) { start = 0 }
    // 截取句子
    sentence = article.slice(start, end)
    // 去除句子中的flag和前后的空格
    sentence = sentence.replace(flag, "").replace(" ", "")
    // 向前
    start -= 2
  }
  // 如果截取的句子比内容还短 或 小于4个字符 或 内容第一个字不在句子里，则继续向前找
  // 去除字母和空格
  sentence = sentence.replace(/[a-zA-Z]/g, "").replace(" ", "")
  // 组装参数
  return { sentence, start, end, flagIndex: index }
}

// 获取给定内容在句子中的位置 （start，end）
function getWordPos(sentence: string, word: string): IPosition[] {
  // 如果存在 … ... 等省略号号，分2段
  // 省略号可能连续存在，用正则
  const wordList = word.split(/……|…|\.|\.\.\./g)
  const posList = []
  for (const word of wordList) {
    const start = sentence.indexOf(word)
    if (start === -1) {
      continue
    }
    const end = start + word.length
    const pos = { start, end }
    posList.push(pos)
  }
  return posList
}

// 解析通假字
function getTongjiaInfo(content: string, word_origin: string): Tongjia {
  if (word_origin.length !== 1) {
    return { is: false }
  }
  // 通假字格式: 同“曝”
  // 包含 同
  if (content.includes('同“')) {
    // 获取引号中的内容
    const word = content.match(/同“(.*?)”/)
    if (word) {
      return { is: true, origin: word[1] }
    }
  }
  return { is: false }
}

// 解析注释内容
function parseContent(content: string, word: string, sentence: string): IWord[] {
  // 语文书写的比较工整，以 。 作分隔，可以分出几部分
  const splContent = content.split('。')
  if (splContent[splContent.length - 1] === '') {
    splContent.pop()
  }
  // 如果只有一个部分，那么那个部分就是注释
  if (splContent.length === 1) {
    return [{ word, sentence, content: splContent[0]+'。', position: getWordPos(sentence, word), tongjia: getTongjiaInfo(splContent[0], word) }]
  }

  const result = []
  for (const contentPart of splContent) {
    // 如果 ， 前的内容 在词中 或 在句子中，前半部分为词，后半部分为解释
    if (contentPart.includes('，')) {
      const contentPartSpl = contentPart.split('，')
      if (!word.includes(contentPartSpl[0]) || !sentence.includes(contentPartSpl[0])) {
        continue;
      }
      // 前半部分为词，后半部分为解释
      const _word = contentPartSpl[0], _content = contentPartSpl.slice(1).join('，') + '。'
      result.push({ word: _word, sentence, content: _content, position: getWordPos(sentence, _word), tongjia: getTongjiaInfo(_content, _word) })
      // 从列表中移除
      // @ts-ignore
      splContent[splContent.indexOf(contentPart)] = null
    }
  }
  // 清除 null
  const _content = splContent.filter(item => item !== null).join('。') + '。'
  result.push({ word, sentence, content: _content, position: getWordPos(sentence, word), tongjia: getTongjiaInfo(content, word) })
  return result
}

// main: 解析注释
export function parseComment(text: string): IWord[] {
  const { article, comments } = splitArticleAndComments(text)
  // flag位置记录
  const flagPosMap = new Map()
  // 遍历注释
  const result = []
  for (let comment of comments) {
    const { flag, word, content, special } = splitComment(comment)
    // 记录flag位置
    if (!flagPosMap.has(flag)) {
      flagPosMap.set(flag, 0)
    }
    const flagPos = flagPosMap.get(flag)
    // TODO
    if (special) { continue; }
    // 1. 获取短句
    const shortSentence = getShortSentence(article, flag, word, flagPos)
    if (!shortSentence) { continue; }
    const { sentence, flagIndex } = shortSentence
    // 更新flag位置
    flagPosMap.set(flag, (flagIndex || 0) + 1)
    // 2. 处理注释内容
    const res_content = parseContent(content, word, sentence)
    result.push(...res_content)
  }
  return result
}

// 转换到题库的格式
export function toQues(words: IWord[]): any {
  return words.map(word => {
    // 题目：根据位置把句子中出现的词语标注出来 用``
    for (const pos of word.position) {
      word.sentence = word.sentence.slice(0, pos.start) + '<' + word.sentence.slice(pos.start, pos.end) + '>' + word.sentence.slice(pos.end)
    }
    return {
      q: word.sentence,
      ans: word.content,
    }
  })
}

// const result = parseComment(text)
// console.log(article,comments)
// console.log(result)
// result.forEach(i=> console.log(`${i.word}\t\t${i.content}`))

// 解析目标：
/* {
  word: string,
  content: string,
  sentence: string,
  position: [ { start: number, end: number }, ...],
  tongjia: { is: boolean, origin: string }
} 
*/