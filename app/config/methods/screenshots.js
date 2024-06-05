// 监听React 发送的消息
const { ipcMain, globalShortcut } = require("electron");

const initScreenShots = (mainWindow) => {
  const screenshots = global.screenshots; //初始化截图插件,截图控件已被挂载至全局变量

  // 监听截图阴影是否获取焦点，动态添加esc事件
  screenshots.on("windowCreated", ($win) => {
    $win.on("focus", () => {
      globalShortcut.register("esc", () => {
        if ($win?.isFocused()) {
          screenshots.endCapture();
        }
      });
    });
    $win.on("closed", () => {
      globalShortcut.unregister("esc");
    });
  });

  // 快捷键截图
  // globalShortcut.register("ctrl+alt+q", () => {
  //   screenshots.startCapture();
  // });

  // 客户端触发截图事件
  ipcMain.on("take-screenshot", (event, args) => {
    screenshots.startCapture(); //开始截图
  });

  // 点击确定按钮回调事件
  screenshots.on("ok", (e, buffer, bounds) => {
    // 向React发送截图信息，buffer为图片文件，bounds为信息
    mainWindow.webContents.send("screenshot-taken", {
      buffer,
      bounds,
    });
    mainWindow.show();
  });

  // 点击取消按钮回调事件
  screenshots.on("cancel", () => {
    mainWindow.show();
  });
};
module.exports = initScreenShots;
