# PAPERCRAFT

### todo
- 子域名
- 域名解析 GET https://www.daluozha.cn/assets/index.5e5debdc.css 404
[已解决]在 vite.config.ts 的 defineConfig 里加上 base: './'


### 编辑器
- vuex -> pinia
- [Naive UI](https://www.naiveui.com/zh-CN/light) 字体跟图标之后再说。
- [unocss](https://uno.antfu.me/) & [作者文章](https://antfu.me/posts/reimagine-atomic-css-zh)



### TodoList

- [x] 拖拽移动
- [x] 八点放缩
- [x] 旋转
- [ ] 吸附线
- [ ] 字体改变
- [x] index.d.ts ：元素类型（区分 text 和 image）


### 已知的 bug
- [x] 放缩以后八点 cursor 变回默认了
- [x] 八点的上下 dot 位置不对
- [ ] 点击旋转时位置会闪，角度总是从 308 度开始