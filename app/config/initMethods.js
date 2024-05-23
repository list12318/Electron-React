// 初始化事件
const initWindowTabbar = require("./methods/tabbar");
const initScreenShots = require("./methods/screenshots");
const initSetWindowSize = require("./methods/windowSize");
const initSetWindowCenter = require("./methods/windowCenter");
const initSetWindowOpacity = require("./methods/windowOpacity");
const initSetWindowPosition = require("./methods/windowPosition");
const initWindowMessage = require("./methods/message");
const setWindowTop = require("./methods/windowTop");

// 截图
const initMethods = (mainWindow) => {
  initWindowTabbar(mainWindow); //自定义标题栏事件

  initScreenShots(mainWindow); //初始化截图监听事件

  initSetWindowSize(mainWindow); //设置窗口大小
  initSetWindowCenter(mainWindow); //设置窗口居中
  initSetWindowOpacity(mainWindow); //设置窗口透明度
  initSetWindowPosition(mainWindow); //设置窗口位置顶部居中

  initWindowMessage(mainWindow); //客户端消息提示组件
  setWindowTop(mainWindow); //设置窗口是否层级置顶
};

module.exports = initMethods;
