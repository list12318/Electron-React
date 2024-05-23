import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./index.less";
import useStore from "@/store";
import { getMessageService, stopAnalysisRes } from "./service";

const Result = () => {
  const navigate = useNavigate();
  const { titleStore } = useStore(); //mobx

  const timeInterRef = useRef(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    window.electronAPI.setWindowSize({ width: 500, height: 40 }); //修改窗口大小
    window.electronAPI.setWindowTop(true); //修改窗口层级置顶
    window.electronAPI.setWindowPosition(); ////修改窗口上方居中
    window.electronAPI.setWindowOpacity({ opacity: 0.7 }); //修改窗口透明度

    titleStore.setShow(false); // 设置标题栏隐藏

    // 轮询查消息
    if (!timeInterRef.current) {
      timeInterRef.current = setInterval(() => getMessage(), 1000);
    }
  }, []);

  const getMessage = async () => {
    const res = await getMessageService({
      pageNum: 1,
      pageSize: 1,
    });
    if (res && res.length) {
      const data = res[0];
      setMessage(`${data.name} ${data.time}`);
    }
  };
  // 停止分析&查看详情
  const viewDetail = async () => {
    clearInterval(timeInterRef.current);
    timeInterRef.current = null;

    const res = await stopAnalysisRes();
    if (res) {
      navigate("/result", { replace: true }); //跳转结果页
    } else {
      message.error("停止分析失败，请重试");
    }
  };

  return (
    <div className="polling">
      <div className="content">
        {message ? <p>{message}</p> : <p>暂无分析结果</p>}

        <Button type="link" onClick={viewDetail}>
          停止分析&查看详情
        </Button>
      </div>
    </div>
  );
};

export default Result;
