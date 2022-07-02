# PAPERCRAFT



### 编辑器
- vuex -> pinia
- ~~[Naive UI](https://www.naiveui.com/zh-CN/light) font & icon~~
- [element plus](https://element-plus.gitee.io/zh-CN/)
- [unocss](https://uno.antfu.me/) & [作者文章](https://antfu.me/posts/reimagine-atomic-css-zh)
- <https://icones.netlify.app/ >



### TodoList

- [x] 拖拽移动
- [x] 八点放缩
- [x] 旋转
- [x] 吸附线
- [x] index.d.ts ：元素类型（区分 text 和 image）
- [ ] image 和 complex 类型
- [x] 域名解析 GET https://www.daluozha.cn/assets/index.5e5debdc.css 404 [已解决]在 vite.config.ts 的 defineConfig 里加上 base: './'
- [ ] 测试库
- [ ] 适配手机端，调试使用[vConsole](https://github.com/Tencent/vConsole)



### 已知的 bug
- [x] 放缩以后八点 cursor 变回默认了
- [x] 八点的上下 dot 位置不对
- [ ] ~~点击旋转时位置会闪，角度总是从 308 度开始【更新：先移除手势操作~~
- [x] vue-tsc 一直报错
- [x] 部署后新加元素不显示文本【render组件问题，已改用element