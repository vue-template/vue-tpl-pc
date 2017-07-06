# benefit

> 嗒嗒乘客福利

## 构建说明

``` bash
# 安装依赖
npm install or yarn

# 开发模式：在本地启动一个带热重载的服务 localhost:8080
npm run dev

# 生产模式：打包代码
npm run build

# 生产模式：打包代码并输出报告
npm run build --report
```

## 目录结构
- build/             => webpack 编译任务
- config/            => webpack 配置文件
- static/            => 静态文件-构建时不会对代码作处理
- src/assets/        => 静态文件
- src/components/    => 组件
- src/views/         => 页面视图
- package.json       => 项目基本信息
- app.json           => 项目构建配置

## webpack 使用文档
[指南](http://vuejs-templates.github.io/webpack/)
[vue-loader 文档](http://vuejs.github.io/vue-loader)
