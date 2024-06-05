import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import useStore from "@/store";
import "./index.less";
import oneImg from "@/assets/one.png";
import fourImg from "@/assets/four.png";
import nineImg from "@/assets/nine.png";
import { elMessage } from "@/util/message";
import { setBox } from "./service";

const ScreenShots = () => {
  const navigate = useNavigate();
  const { titleStore } = useStore(); //mobx

  useEffect(() => {
    window.electronAPI.setFullScreen(false); //取消全屏
    window.electronAPI.setWindowTop(true); //修改窗口层级置顶

    window.electronAPI.setWindowSize({ width: 110, height: 40 }); //修改窗口大小
    window.electronAPI.setWindowPosition(); //修改窗口上方居中
    window.electronAPI.setWindowOpacity({ opacity: 0.7 }); //修改窗口透明度

    titleStore.setShow(false); // 设置标题栏隐藏

    // 单宫格截图完毕通知消息
    window.electronAPI.screenshotTaken((data) => {
      // console.log("收到消息", data);
      window.electronAPI.setWindowShow(true); //修改窗口隐藏
      callbacksize(data);
    });

    // 获取屏幕快照通知消息
    window.electronAPI.callbackShots((data) => {
      window.electronAPI.setWindowShow(true);
      // console.log("屏幕快照信息", data);
      navigate("/fournineRender", { state: data });
    });

    return () => {};
  }, []);

  // 单宫格截图
  const oneScreenShots = () => {
    window.electronAPI.setWindowShow(false); //修改窗口隐藏

    window.electronAPI.takeScreenshot();
  };
  // 多宫格截图
  const gridScreenShots = (num) => {
    // setFourLoading(true);
    window.electronAPI.setWindowShow(false);
    window.electronAPI.getScreenShots(num);
  };

  // electron截图完毕回调
  const callbacksize = async (data) => {
    const {
      bounds: {
        display: { width: screenWidth, height: screenHeight },
        bounds: { x, y, width, height },
      },
    } = data;

    // 计算相对整体图片比例
    const requestData = [
      {
        x: x / screenWidth,
        y: y / screenHeight,
        w: width / screenWidth,
        h: height / screenHeight,
      },
    ];

    const res = await setBox(requestData);

    if (res) {
      navigate("/config");
    } else {
      elMessage({
        title: "系统错误",
        subTitle: "系统错误，截图上传失败，请重试或联系管理员",
      });
    }
  };

  return (
    <div className="screen-shots">
      <ul className="screen-box">
        <li onClick={oneScreenShots}>
          <img className="one" title="单宫格截图" src={oneImg} alt="" />
        </li>
        <li onClick={() => gridScreenShots(4)}>
          <img className="four" title="四宫格截图" src={fourImg} alt="" />
        </li>
        {/* <li onClick={() => gridScreenShots(9)}>
          <img className="nine" title="九宫格截图" src={nineImg} alt="" />
        </li> */}
      </ul>
    </div>
  );
};

export default ScreenShots;
