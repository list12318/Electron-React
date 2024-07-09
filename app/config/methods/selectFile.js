const { app, ipcMain, dialog } = require("electron");

const appQuit = (mainWindow) => {
  // 客户端触发事件
  ipcMain.handle("select-file", async (event, data) => {
    const res = await dialog.showOpenDialog({
      title: "文件选择",
      buttonLabel: "确认",
      properties: [data, "multiSelections"], // 选择文件或文件夹
      filters: [{ name: "videos", extensions: ["mp4", "mov", "flv", "mkv"] }], //只允许选择这些文件
    });

    return res;
  });
};
module.exports = appQuit;
