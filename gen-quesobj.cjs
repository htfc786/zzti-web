// 感谢 程序员小山与Bug 提供思路
// https://github.com/sunzsh/vue-el-demo/blob/master/gen-router.js
// 参考： https://juejin.cn/post/7214831158873817143

var fs = require('fs');
var path = require('path');

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

async function exitsFolder(reaPath) {
  // 传入文件夹的路径看是否存在，存在不用管，不存在则直接创建文件夹
  // https://blog.csdn.net/qq_41499782/article/details/112257554
  const absPath = path.resolve(__dirname, reaPath);
  try {
    await fs.promises.stat(absPath)
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    await fs.promises.mkdir(absPath, {recursive: true})
  }
}

function download(url,fileName,dir){
  console.log('------------------------------------------------')
  console.log(url)
  console.log(fileName)
  console.log(dir)
  let stream = fs.createWriteStream(path.join(dir, fileName));
  request(url).pipe(stream).on("close", function (err) {
      console.log("文件" + fileName + "下载完毕");
  });
}

function getObj(path) {
  var result = {};
  const items = fs.readdirSync(path);
  items.forEach(item => {
    const itemPath = `${path}/${item}`;
    if (fs.statSync(itemPath).isDirectory()) {
      // 如果是文件夹递归计算
      let children = getObj(itemPath);
      result[item] = children;
    } else { // 文件
      var file_list = item.split('.'); //获取扩展名，检查扩展名是不是txt
      if (file_list.length>=2 && file_list[file_list.length - 1] == fileExt) {
        //生成文件名
        file_list.pop();
        const name = file_list.join(".");
        //读取文件
        const data_text = fs.readFileSync(itemPath, fileEncoding);
        //按行分割
        const data = data_text.toString().split("\n");
        //结果
        var fileResult = [];
        //是否存在答案 /#(.*?)answer(.*?)=(.*?)true(.*?)/ 
        const hasAns = /#(.*?)answer(.*?)=(.*?)true(.*?)/.test(data[0])
        const resI = hasAns ? 1 : 0;
        for (var i = resI; i < data.length; i++) {
          // 问题
          var question = replaceText(data[i]);
          if (!question) { continue; } //空行
          //答案
          let answer;
          if(hasAns) {
            answer = replaceText(data[i+1] ? data[i+1] : "");
            answer && i++; //如果有答案，跳过下一行
          }
          //结果
          const quesResult = answer ? { q: question, ans: answer } : { q: question }; 
          fileResult.push(quesResult);
        }
        // 加入总结果
        result[name] = fileResult;
      }
    }
  });
  return result;
}

(async () => {
  // 问题对象的文本格式
  const questionObj = getObj(questionDir);
  // 备注
  const noteText = `数据更新日期 ${getNowTimeStr()}`;
  
  const result = {
    data: questionObj,
    note: noteText
  };

  // const resultText = JSON.stringify(result, null, 2);
  const resultText = JSON.stringify(result);

  // 文件操作
  // 检查data文件夹是否存在
  await exitsFolder('./src/data');
  // 保存文件
  fs.writeFile('./src/data/index.json', resultText, 'utf-8', 
    (err) => {  
      if (err) throw err; 
      // 如果没有错误
      console.log("./src/data/index.json 生成成功！") 
    });
// });
})();
