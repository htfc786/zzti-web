export interface Word {
  index?: number;
  word: string;
  pronounce: string;
  chinese: string;
}
// 解析单词表
export function parseWordList(wordListString: string): Word[] {
  // 转换数组
  // 去除空行
  // 去除所有的 ▫ 和 * 及其后面的空格
  const wordListStringLine = wordListString
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.replace(/^[*▫]/, '').trim())
  // 合并内容
  // 如果下一行不已英文字母开头,把内容转到上一行
  for (let i = 0; i < wordListStringLine.length - 1; i++) {
    if (!/^[a-zA-Z]/.test(wordListStringLine[i + 1])) {
      // 如果已字母结束,添加空格
      const isEndWithLetter = /[a-zA-Z]$/.test(wordListStringLine[i][wordListStringLine[i].length - 1]);
      wordListStringLine[i] += (isEndWithLetter ? ' ' : '') + wordListStringLine[i + 1];
      wordListStringLine.splice(i + 1, 1);
    }
  }
  // 提取内容
  // senior /ˈsiːniə/ adj. （地位、水平或级别）高的，高级的 1
  // butterflies in one’s stomach 情绪紧张，心里发慌 4
  // 提取单词、音标和中文
  const words = wordListStringLine.map((wordLine,index) => {
    const data = wordLine.split(' ');
      // 去除数组最后一项页码
    data.pop();
    // 判断是否是单词
    // 判断是否存在音标(/ˈsiːniə/)
    if (wordLine.includes('/')) { // 单词
      return { 
        index: index + 1,
        word: data[0], 
        pronounce: data[1], 
        chinese: data.slice(2).join(' ') 
      };
    } else { // 词组
      return {
        index: index + 1,
        word: data.slice(0, -1).join(' '),//前面几项
        pronounce: '', 
        chinese: data[data.length - 1]//最后一项
      };
    }
  })
  return words;
}