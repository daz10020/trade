# react native 项目

### 启动本地项目步骤:

执行 `npm install` 安装依赖

执行 `npm run android` 或 `npm run ios`

注
1、sharedBlacklist报错

替换为

var sharedBlacklist = [

/node_modules[\\/\\\\]react[\\/\\\\]dist[\\/\\\\].*/,

/website\/node_modules\/.*/,

/heapCapture\/bundle\.js/,

/.*\/__tests__\/.*/];
