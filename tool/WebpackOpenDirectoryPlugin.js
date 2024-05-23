const { exec } = require("child_process");
const path = require("path");

class WebpackOpenDirectoryPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap("Webpack Open Directory Plugin", (stats) => {
      // 这里调用之前封装的函数，传入目标路径
      openDirectory(this.options.path);
    });
  }
}

const openDirectory = (relativePath) => {
  const absolutePath = path.resolve(__dirname, relativePath);

  let command;

  // 根据操作系统选择合适的命令
  if (process.platform === "win32") {
    // Windows系统
    command = `explorer "${absolutePath}"`;
  } else if (process.platform === "darwin") {
    // macOS系统
    command = `open "${absolutePath}"`;
  } else {
    // Linux系统或其他Unix系统
    command = `xdg-open "${absolutePath}"`;
  }

  // 执行命令
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令产生错误: ${error}`);
      console.error("Stderr:", stderr);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`标准输出：${stdout}`);
    console.log(`成功打开目录: ${absolutePath}`);
  });
};

module.exports = WebpackOpenDirectoryPlugin;
