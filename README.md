# zzti
帮政治老师开发的抽题系统

zzti 是我帮政治老师开发的抽题系统，可以在随机抽题让学生默写、背诵等等，项目采用纯前端实现，可使用`GitHub Page`部署上线

提示：因为本项目是纯前端项目`没有`后台管理系统，所以题目以文本文件的形式存在`question`文件夹内

## 提示
当前您访问的为本项目的`纯前端实现版本`，服务器版本版本具体请访问：https://github.com/htfc786/zzti-server

## 功能
1. 默写页面 可以选择题目个数，从已有题目进行抽取
![默写页面](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/page/indexpage.png)

2. 抽题页面 从已有题目随机抽取一道
![默写页面](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/page/randompage.png)

3. 问题列表 显示所有录入的题
![默写页面](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/page/questionspage.png)

- 感觉这个项目发散一下可以在不改代码的情况下应用到大部分学科的教学之中，如：语文看音写词、随机抽取古诗背诵等等（提示：本人是学生，在这方面没有话语权，好与坏不是我个人说了算的）

## 如何使用？
#### 安装部署
- 全部过程`完全免费`，只需要一个GitHub账号即可完成
1. 注册登录GitHub账号：
打开 `github.com` 点右上角 ![Sign up](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/signup.png) ，注册全过程只需要一个邮箱，点击右上角 ![Sign in](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/signin.png)登录

2. 复制代码：
打开 https://github.com/htfc786/zzti ，点击右上角 ![Fork](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/fork.png) 按钮，在弹出的页面上点击右下角 ![Create fork](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/createfork.png) 等待新页面弹出即可

3. 检查设置：
在弹出的新页面点击上方 ![Settings](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/settings.png) ，在右侧列表点击 ![Actions](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/sett-actions.png) => ![General](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/sett-general.png)，把页面拉到最下面，找到 `Workflow permissions` ，确保设置和下图一样，最后点击 `Save` 保存设置即可
![General](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/workflow-settings.png)

4. 开启自动化部署：
点击上方的 ![Actions](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/actions.png) ，点击页面中间的 ![I understand my workflows, go ahead and enable them](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/enableworkflows.png) 按钮，之后在右侧列表里点击 ![build website](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/buildwebsite.png) 选项，之后点击右侧 ![Run workflow](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/runworkflow.png)，在下方弹出窗口点击 ![绿色的Run workflow](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/runworkflow-g.png) ，启动自动化部署。等待1分钟左右，等待自动化部署执行完成

5. 开启页面服务：
在页面点击上方 ![Settings](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/settings.png) ，在右侧列表点击 ![Pages](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/btn/pages.png)，在 `Branch` 选项卡下面的`下拉框`选择`website`选项，最后点击`Save`保存设置
![设置GitHubPages页面](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/set-pages.png)
等待1分钟左右，刷新页面，您就可以看到访问地址了，点击即可访问
![GitHubPages网址页面](https://raw.githubusercontent.com/htfc786/zzti-server/img/zzti-web/img/help/urlpage.png)

#### 更多使用说明请等待后续更新

## 软件
- 使用框架：`Vue`
- 前端组件库：`Ant Design Vue`
- 构建工具：`vite`

Made by htfc786