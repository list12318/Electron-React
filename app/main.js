const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { debounce } = require("lodash");
const NODE_ENV = process.env.NODE_ENV;

const initTray = require("./config/initTray"); //初始化托盘
const initControl = require("./config/initControl"); //初始化基础控件(如截图控件)
const initMethods = require("./config/initMethods"); // 监听子系统事件

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 120,

    // resizable: false, //禁止拖拽大小
    titleBarStyle: "hidden", //隐藏原生标题栏，自定义标题栏实现在src/router/index.jsx

    alwaysOnTop: false, // 窗口永远在其他应用程序层级之上
    icon: "./libs/icon/logo.ico", //本地启动时任务栏图标

    show: false, //先隐藏，防止闪屏
    backgroundColor: "#23272e", //默认背景色，先显示，防止打开一直不出窗口影响用户体验

    // web配置
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools(); //开发环境默认打开开发者工具
  } else {
    mainWindow.loadFile(path.join(__dirname, "./dist/index.html"));
    // mainWindow.webContents.openDevTools(); //生产环境
  }
  // 渲染进程加载完毕后
  mainWindow.once("ready-to-show", () => {
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

  // 窗口关闭
  mainWindow.on("close", function (event) {
    if (!app.isQuitting) {
      event.preventDefault(); // 阻止默认关闭行为
      mainWindow.hide(); // 最小化到托盘
    }
  });
};

app.on("ready", () => {
  createWindow(); //创建窗口
  initTray(mainWindow); //创建托盘
  initControl(); //初始化基础控件
  initMethods(mainWindow); // 监听子系统事件
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
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
