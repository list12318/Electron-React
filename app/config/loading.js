const { app, BrowserWindow } = require("electron");
const path = require("path");
// 创建loading窗口
const initLoadingWindow = async (initMainWindow) => {
  const loadingWindow = new BrowserWindow({
    width: 200,
    height: 200,

    frame: false, // 无边框（窗口、工具栏等），只包含网页内容
    resizable: false, //禁止拖拽大小
    alwaysOnTop: true, // 窗口永远在其他应用程序层级之上
    icon: "./libs/icon/logo.ico", //本地启动时任务栏图标
    backgroundColor: "#23272e", //默认背景色，先显示，防止打开一直不出窗口影响用户体验
  });

  loadingWindow.once("show", initMainWindow);
  loadingWindow.loadFile(path.join(__dirname, "../components/loading.html"));

  // loadingWindow.webContents.openDevTools(); //打开开发者工具
  loadingWindow.show();

  global.loadingWindow = loadingWindow;
};

module.exports = initLoadingWindow;
