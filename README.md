# PAPERCRAFT



### Deps
- vuex ➡️ [pinia](https://pinia.vuejs.org/)
- [vue-router](https://router.vuejs.org/)
- ~~[Naive UI](https://www.naiveui.com/zh-CN/light) font & icon~~
- [element plus](https://element-plus.gitee.io/zh-CN/)
- [unocss](https://uno.antfu.me/) & [作者文章](https://antfu.me/posts/reimagine-atomic-css-zh)
- <https://icones.netlify.app/ >



### TodoList

- [x] 拖拽移动，吸附线，八点放缩，旋转
- [x] index.d.ts ：元素类型（区分 text 和 image）
- [x] image 和  ~~complex~~ 类型
- [x] 域名解析 GET https://www.daluozha.cn/assets/index.5e5debdc.css 404 [已解决]在 vite.config.ts 的 defineConfig 里加上 base: './'
- [ ] 背景渐变
- [ ] 配合 puppeteer 实现图片保存【暂时在 [Yuubee](https://github.com/daluozha/Yuubee)，之后考虑放在本项目 packages 目录下
- [x] 弹窗添加图片元素(1.url添加 2.~~本地上传到图床再添加~~)
- [ ] 测试库 [Jest 实践指南](https://github.yanhaixiang.com/jest-tutorial/)
- [ ] 适配手机端，调试使用[vConsole](https://github.com/Tencent/vConsole)



### Issues
- [x] 放缩以后八点 cursor 变回默认了
- [x] 八点的上下 dot 位置不对
- [ ] ~~点击旋转时位置会闪，角度总是从 308 度开始~~【更新：先移除手势操作
- [x] vue-tsc 一直报错
- [x] 部署后新加元素不显示文本【render 组件问题，已改用 element-render
- [x] 背景 zIndex 过高，导致选不中其他元素
- [ ] ~~选中背景时，border 会被在边缘的元素遮挡住[贴边判断用大于等于 1 来操作，不是真正贴边~~【更新：无法解决，zIndex 的问题
- [ ] 截图时网页没有最新的 store 状态，还是最初的 allData 【尝试用 localStorage 或者 vueuse 相关函数