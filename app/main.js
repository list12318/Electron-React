const { app, globalShortcut } = require("electron");
// 禁用GPU加速
app.disableHardwareAcceleration();

// const initLoadingWindow = require("./config/loading");
const initMainWindow = require("./config/initMainWindow"); //初始化主窗口
const initTray = require("./config/initTray"); //初始化托盘
const initControl = require("./config/initControl"); //初始化基础控件(如截图控件)
const initMethods = require("./config/initMethods"); // 监听子系统事件

const gotTheLock = app.requestSingleInstanceLock();

// 你的最新打开的应用程序是否取得锁，如果没有，那就代表有其他应用程序在运行
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 有人试图运行第二个实例，我们应该打开显示当前实例的窗口
    if (global.mainWindow) {
      if (global.mainWindow.isMinimized()) global.mainWindow.restore();
      global.mainWindow.focus();
    }
  });

  app.on("ready", () => {
    // initLoadingWindow(initMainWindow);
    initMainWindow(); //创建窗口

    initTray(global.mainWindow); //创建托盘
    initControl(); //初始化基础控件
    initMethods(global.mainWindow); // 监听子系统事件
  });
  app.on("activate", function () {
    if (global.mainWindow === null) {
      initMainWindow(); //创建窗口
    }
  });
  app.on("before-quit", () => {
    app.isQuitting = true;
  });
  // 所有窗口关闭时
  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  // 退出程序
  app.on("will-quit", () => {
    // windows环境注销所有快捷键
    globalShortcut.unregisterAll();
  });
}
