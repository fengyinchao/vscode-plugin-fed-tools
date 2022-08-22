## README

## 功能

### 代码规范可视化接入

### snippets

- ✅ @shark/react-native-component 组件自动完成和文档提示，快捷键 dy-
  ![](https://sta-op.douyucdn.cn/butterfly-java/2022/05/11/a79cf5335f3f906e0396b5582465230c.jpg)
  ![](https://sta-op.douyucdn.cn/butterfly-java/2022/05/11/600877585516df5645c41421a969990c.jpg)

- ✅ 一键生成 RN 页面，快捷键 grnc
  ![](https://sta-op.douyucdn.cn/butterfly-java/2022/05/11/1a3a4945dbe4c30a51ced4d9a57bc550.jpg)

- ✅ ReactNative 原生组件输入提示，预填充 style 字段，快捷键 vs(View),ts(Text) 等
  ![](https://sta-op.douyucdn.cn/butterfly-java/2022/05/11/726c36ab9632a938c2649e796fc786dd.jpg)

- ✅ ReactNative 样式代码提示，快捷键 jcc,jcb,aic,fdr 等
  ![](https://sta-op.douyucdn.cn/butterfly-java/2022/05/11/754a9bd5723282d7f6abe01f30af5e58.jpg)

### 项目可视化创建

- ❌ RN 活动
- ❌ RN 页面
- ❌ WebM H5

### 小工具

- ❌ 一键标准化(接入 TS、ESLint、Prettier、EditorConfig、StyleLint、Husky、Shark-Ci)
- ❌ css to react-native style
- ❌ json to ts interface
- ...

## 维护

```bash
npm install -g vsce
vsce login fengyinchao
# 密码：找 fengyinchao
vsce publish
# 查看发布状态
https://marketplace.visualstudio.com/manage/publishers/fengyinchao

# 查看应用市场
https://marketplace.visualstudio.com/search?target=VSCode&category=All%20categories&sortBy=Installs
```

开发了一个 vscode 插件: fed-tools(可在 vscode 里搜索安装，安装成功后左侧面板有个闪电形状的图标)。目前集成了 RN 相关的一些 snippets，具体包含：

1、@shark/react-native-component 组件自动完成和文档提示，快捷键 dy-；
2、一键生成 RN 页面，快捷键 grnc
3、ReactNative 原生组件输入提示，预填充 style 字段，快捷键 vs(View),ts(Text) 等
4、ReactNative 样式代码提示，快捷键 jcc,jcb,aic,fdr 等

欢迎大家使用和完善
