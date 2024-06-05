const { app, BrowserWindow } = require("electron");
const path = require("path");
const NODE_ENV = process.env.NODE_ENV;
const { debounce } = require("lodash");
// 创建主窗口
const initWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,

    frame: false, //无边框窗口
    resizable: false, //禁止拖拽大小
    titleBarStyle: "hidden", //隐藏原生标题栏，自定义标题栏实现在src/router/index.jsx

    alwaysOnTop: false, // 窗口永远在其他应用程序层级之上
    icon: "./libs/icon/logo.ico", //本地启动时任务栏图标

    show: false, //先隐藏，防止闪屏
    backgroundColor: "#23272e", //默认背景色，先显示，防止打开一直不出窗口影响用户体验

    // web配置
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  if (NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools(); //开发环境默认打开开发者工具
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    // mainWindow.webContents.openDevTools(); //生产环境
  }
  // 渲染进程加载完毕后
  mainWindow.once("ready-to-show", () => {
    // global.loadingWindow.close(); //关闭loading窗口
    mainWindow.show(); //显示窗口
  });

  // 监听窗口大小改变事件
  mainWindow.on(
    "resize",
    debounce(() => {
      mainWindow.webContents.send("window-resize");
    }, 500)
  );

  // 监听窗口获得焦点
  // mainWindow.on("focus", () => {
  //   console.log("jiaodian");
  // });

  // // 监听窗口失去焦点
  // mainWindow.on("blur", () => {
  //   console.log("shiqujiaodian");
  // });

  global.mainWindow = mainWindow;
};

module.exports = initWindow;
