// 初始化electron 基础控件

const Screenshots = require("electron-screenshots");

const initControl = () => {
  global.screenshots = new Screenshots({}); //初始化截图控件
};

module.exports = initControl;
