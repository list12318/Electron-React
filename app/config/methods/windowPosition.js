// 监听React 发送的消息
const { ipcMain, screen } = require("electron");

const initSetWindowPosition = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-position", (event, size) => {
    const windowBounds = mainWindow.getBounds();

    // 获取主显示器
    const primaryDisplay = screen.getPrimaryDisplay();
    const displayBounds = primaryDisplay.bounds;

    // 窗口与屏幕顶部距离设为0
    const newY = displayBounds.y;

    // 为了水平居中窗口，我们需要计算新的X坐标
    const newX = Math.round(displayBounds.x + displayBounds.width / 2 - windowBounds.width / 2);

    mainWindow.setBounds({
      x: newX,
      y: newY,
      // width: windowBounds.width, // 保持当前宽度
      // height: windowBounds.height, // 保持当前高度
    });
  });
};
module.exports = initSetWindowPosition;
