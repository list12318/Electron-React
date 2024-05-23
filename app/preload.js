// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// electron 主进程监听渲染进程方法，双向通信，渲染进程使用window.electronAPI.xxx 调用
contextBridge.exposeInMainWorld("electronAPI", {
  windowResize: (callback) => ipcRenderer.on("window-resize", (event, data) => callback(data)), //窗口大小变动通知渲染端

  takeScreenshot: (data) => ipcRenderer.send("take-screenshot", data), //截图
  screenshotTaken: (callback) => ipcRenderer.on("screenshot-taken", (event, data) => callback(data)), //截图完毕通知渲染端

  setWindowMin: (data) => ipcRenderer.send("set-window-min", data), //最小化
  setWindowMax: (data) => ipcRenderer.send("set-window-max", data), //最大化
  setWindowClose: (data) => ipcRenderer.send("set-window-close", data), //关闭窗口

  setWindowCenter: (data) => ipcRenderer.send("set-window-center", data), //窗口居中

  setWindowOpacity: (data) => ipcRenderer.send("set-window-opacity", data), //设置窗口透明度

  setWindowPosition: (data) => ipcRenderer.send("set-window-position", data), //设置窗口位置

  setWindowSize: (data) => ipcRenderer.send("set-window-size", data), //设置窗口大小

  setWindowTop: (data) => ipcRenderer.send("set-window-top", data), //设置窗口层级永远置顶
});
