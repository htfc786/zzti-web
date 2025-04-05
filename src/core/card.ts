export interface cardContent {
  front: string,
  back: string,
  content?: string,
}
export interface pageContent {
  width: number,
  height: number, 
  rows: number, 
  cols: number,
  contents: string[],
  pageNum: string
}
export type fontSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export interface cardStyle {
  fontSize: fontSize, color: string
}
export interface paperConfig { 
  size: 'horizontal' | 'vertical',
  count: { x: number, y: number },
  contentPosition: 'front' | 'back',
  showCardNum: boolean,
  showPageNum: boolean
}
export interface cardConfig {
  front: cardStyle,
  back: cardStyle,
  content: cardStyle,
  paper: paperConfig,
}
// 生成卡片
export function createCard(content: string, size: { width: string, height: string }) {
  const card = document.createElement('div')
  // 内容
  const contentDom = document.createElement('div')
  contentDom.innerHTML = content
  // 左右加上空白
  contentDom.style.padding = '0 20px'
  card.style.position = 'relative'
  card.appendChild(contentDom)
  // 大小
  const { width, height } = size
  card.style.width = width
  card.style.height = height
  // 内容居中
  card.style.display = 'flex'
  card.style.justifyContent = 'center'
  card.style.alignItems = 'center'
  return card;
}

// 创建纸张dom
export async function createImage(data: pageContent) {
  const paper = document.createElement('div')
  paper.style.width = `${data.width}mm`
  paper.style.height = `${data.height}mm`
  // paper.style.border = '1px solid #ccc'
  // grid 布局
  paper.style.display = 'grid'
  paper.style.gridTemplateColumns = `repeat(${data.cols}, 0fr)`
  paper.style.gridTemplateRows = `repeat(${data.rows}, 1fr)`
  paper.style.textAlign = 'center'

  // 绘制卡片
  // 计算卡片横竖长度
  const cardWidth = data.width / data.cols
  const cardHeight = data.height / data.rows
  // 创建卡片元素，填满区域
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < data.contents.length; i++) {
    const content = data.contents[i]
    const card = createCard(content, { 
      width: `${cardWidth}mm`, 
      height: `${cardHeight}mm`
    });
    fragment.appendChild(card);
  }
  paper.appendChild(fragment); 

  // 添加页码
  const page = document.createElement('div')
  page.style.position = 'absolute'
  page.style.bottom = '5mm'
  page.style.right = '5mm'
  page.innerText = data.pageNum + "";
  paper.appendChild(page)
  paper.style.position = 'relative'

  
  // 创建一个看不见的元素用于绘制
  const drawDom = document.createElement('div');
  drawDom.style.position = 'absolute';
  drawDom.style.left = '-99999px';
  drawDom.style.top = '-99999px';
  document.body.appendChild(drawDom);
  drawDom.appendChild(paper);
  // 尝试转换
  let image = "";

  const html2canvas = await import('html2canvas');
  // @ts-ignore
  try {
    const canvas = await html2canvas.default(paper, { scale:1 });
    image = canvas.toDataURL("image/png");
  } catch (error) {
    console.error('html2canvas 失败:', error);
  } finally {
    document.body.removeChild(drawDom);
  }
  return image;
}


const createContent = (content:string, config: cardStyle) => `<${config.fontSize} style="color:${config.color}">${content}</${config.fontSize}>`
const createFront = (front:string, config: cardStyle, content: string, config2: cardStyle) => createContent(front, config) + (content ? createContent(content, config2) : '')
const createBack = (back:string, config: cardStyle, content: string, config2: cardStyle, index: number|'') => createContent(back, config) + (content ? createContent(content, config2) : '')+`<div style="position:absolute;bottom:5mm;right:5mm">${index}</div>`

export function createPage(contents: string[], config: paperConfig, pageNum: number): pageContent {
  const { size, count, showPageNum } = config
  const { x: cols, y: rows } = count
  const width = size === 'horizontal' ? 297 : 210
  const height = size === 'horizontal' ? 210 : 297
  // 页面数据
  return {
    width, height, rows, cols,
    // 卡片内容
    // 直接传入HTML
    contents,
    // 页面信息
    pageNum: `${showPageNum ? pageNum : ''}`
  }
}

// 生成打印纸的参数
export function createPaperData(wordsList: cardContent[], config: cardConfig) {
  // 解析
  const { front, back, content, paper } = config
  // 一个页面的卡片数
  const { x: cols, y: rows } = paper.count
  const pageCardNum = rows * cols;
  
  const result = []

  let frontContents = new Array(pageCardNum).fill('')
  let backContents = new Array(pageCardNum).fill('')
  for (let i = 0; i < wordsList.length; i++) {
    const pageIndex = i % pageCardNum
    const word = wordsList[i]
    const frontContent = paper.contentPosition === 'front' ? word.content || '' : ''
    frontContents[pageIndex] = createFront(word.front, front, frontContent, content)

    // 在那一行
    const rowIndex = Math.floor(pageIndex / cols)
    // 在哪一列
    const colIndex = pageIndex % cols

    const pageIndex2 = rowIndex * cols + cols-1-colIndex

    const backContent = paper.contentPosition === 'back' ? word.content || '' : ''
    backContents[pageIndex2] = createBack(word.back, back, backContent, content, paper.showCardNum?i+1:'')
    // 打包一页
    if (pageIndex === pageCardNum - 1 || i === wordsList.length - 1) {
      const pageNum = Math.ceil(i / pageCardNum) * 2 - 1
      result.push(createPage(frontContents, paper, pageNum))
      result.push(createPage(backContents, paper, pageNum+1))
      frontContents = new Array(pageCardNum).fill('')
      backContents = new Array(pageCardNum).fill('')
    }
  }
  return result;
}

export async function createPdf(images: string[], config: paperConfig) {
  const jspdf = await import('jspdf')
  // 横向的pdf
  const orientation = config.size === 'horizontal' ? 'l' : 'p';
  const format = config.size === 'horizontal' ? [297, 210] : [210, 297];
  const pdf = new jspdf.jsPDF({
    orientation,
    unit: 'mm',
    format
  });
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    pdf.addImage(img, 'JPEG', 0, 0, format[0], format[1]);
    if (i < images.length - 1) {
      pdf.addPage();
    }
  }
  return pdf.output('blob');
}