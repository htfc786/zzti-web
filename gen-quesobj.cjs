// 感谢 程序员小山与Bug 提供思路
// https://github.com/sunzsh/vue-el-demo/blob/master/gen-router.js
// 参考： https://juejin.cn/post/7214831158873817143

var fs = require('fs');

const questionDir = './question';
const fileExt = "txt";
const fileEncoding = "utf-8";

function getNowTimeStr(){
  // https://juejin.cn/post/7238510595543351354
  const date = new Date();
  const year = date.getFullYear();  
  const month = (date.getMonth() + 1).toString().padStart(2, '0');  
  const day = date.getDate().toString().padStart(2, '0'); 
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;  
  console.log(formattedDate);
  return formattedDate;
}

function replaceText(text) {
  var res;
  res = text.replace(/\r/g, '');
  res = res.replace(/\\/g, '');
  res = res.replace(/"/g, '\\"');
  return res;
}

function getObj(path) {
  var result = "{";
  const items = fs.readdirSync(path);
  items.forEach(item => {
    const itemPath = `${path}/${item}`;
    if (fs.statSync(itemPath).isDirectory()) {
      // 如果是文件夹递归计算
      let children = getObj(itemPath);
      result += `"${item}": ${children},`;
    } else { // 文件
      var file_list = item.split('.'); //获取扩展名，检查扩展名是不是txt
      if (file_list.length>=2 && file_list[file_list.length - 1] == fileExt) {
        //生成文件名
        file_list.pop();
        const name = file_list.join(".");
        //读取文件
        const data = fs.readFileSync(itemPath, fileEncoding);
        //按行分割
        const add_list = data.toString().split("\n");
        //循环遍历每一行
        var fileResult = "[";
        for (i = 0; i < add_list.length; i++) {
          // 替换违法字符 
          var add_res = replaceText(add_list[i]);
          //空行
          if (!add_res) { continue } 
          //加入结果
          fileResult += `"${add_res}", `;
        }
        fileResult += "]";
        // 加入总结果
        result += `"${name}": ${fileResult}, `;
      }
    }
  });
  return result + "}";
}
// 问题对象的文本格式
const questionObjText = getObj(questionDir);
// 备注
const noteText = `数据更新日期 ${getNowTimeStr()}`;

const result = `\
// 该文件由 gen-quesobj.cjs 自动生成，请勿手动修改
// 题目数据
export default ${questionObjText};
export const questionNote = "${noteText}";
` 

fs.writeFile('./src/questions/questions.ts', result, 'utf-8', 
  (err) => {  
    if (err) throw err; 
    // 如果没有错误
    console.log("./src/questions/questions.ts 生成成功！") 
  });
