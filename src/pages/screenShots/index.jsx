import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import useStore from "@/store";
import "./index.less";
import { elMessage } from "@/util/message";
import { setBox } from "./service";

const ScreenShots = () => {
  const navigate = useNavigate();
  const { titleStore } = useStore(); //mobx

  useEffect(() => {
    window.electronAPI.setWindowSize({ width: 140, height: 40 }); //修改窗口大小
    window.electronAPI.setWindowTop(true); //修改窗口层级置顶
    window.electronAPI.setWindowPosition(); ////修改窗口上方居中
    window.electronAPI.setWindowOpacity({ opacity: 0.7 }); //修改窗口透明度

    titleStore.setShow(false); // 设置标题栏隐藏

    // 接收来自electron的消息
    window.electronAPI.screenshotTaken((data) => {
      console.log("收到消息", data);
      // const { bounds, buffer } = data;

      callbacksize(data);

      // buffer转base64
      // let bytes = new Uint8Array(buffer);
      // let binary = "";
      // bytes.forEach((byte) => {
      //   binary += String.fromCharCode(byte);
      // });
      // let base64String = window.btoa(binary);
      // const imgBaseUrl = "data:image/png;base64," + base64String;

      // // 设置图片
      // setImgUrl(imgBaseUrl);

      // setFrame(bounds);
    });

    return () => {};
  }, []);

  // 手动点击按钮触发截图
  const screenShots = () => {
    window.electronAPI.takeScreenshot();
  };

  // electron截图完毕回调
  const callbacksize = async (data) => {
    const {
      bounds: {
        display: { width: screenWidth, height: screenHeight },
        bounds: { x, y, width, height },
      },
    } = data;

    const requestData = [
      {
        x: x / screenWidth,
        y: y / screenHeight,
        w: width / screenWidth,
        h: height / screenHeight,
      },
    ];

    // console.log(
    //   1111,
    //   {
    //     screenWidth,
    //     screenHeight,
    //     x,
    //     y,
    //     width,
    //     height,
    //   },
    //   requestData
    // );

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
      <div className="screen-box" onClick={screenShots}>
        点击此处开始截图
      </div>
    </div>
  );
};

export default ScreenShots;
