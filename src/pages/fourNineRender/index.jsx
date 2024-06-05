import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, message } from "antd";
import useStore from "@/store";
import "./index.less";
import okImg from "@/assets/ok.png";
import cancelImg from "@/assets/cancel.png";
import { setBox } from "./service";
import { cloneDeep } from "lodash";
import Draggable from "react-draggable";

const GridScreenShots = () => {
  const { titleStore } = useStore(); //mobx
  const navigate = useNavigate();
  const { state } = useLocation();

  const imgRef = useRef();
  const canvasRef = useRef();

  const [boxStyle, setBoxStyle] = useState({ width: 0, height: 0 });

  const [hor, setHor] = useState([]);
  const [ver, setVer] = useState([]);

  useEffect(() => {
    window.electronAPI.setFullScreen(true); //窗口全屏
    window.electronAPI.setWindowTop(true); //修改窗口层级置顶
    window.electronAPI.setWindowOpacity({ opacity: 1 }); //修改窗口透明度

    titleStore.setShow(false); // 设置标题栏隐藏

    return () => {};
  }, []);

  useEffect(() => {
    if (state && state.imageData) {
      const {
        sizeInfo: { width, height, scaleFactor },
        gridSize,
      } = state;

      setBoxStyle({ width, height });

      const gridData = { gridSize, width, height, scaleFactor }; // gridSize代表是几宫格，width/height是整体画布大小,scaleFactor是缩放比例
      const { hor, ver } = calculateGridLines(gridData); //自动绘制线

      setHor(hor);
      setVer(ver);
    }
  }, [state]);

  // 根据传入参数自动计算线坐标，支持4 6 9 16宫格
  const calculateGridLines = (data) => {
    const { gridSize, width, height, scaleFactor } = data;

    let rows, cols;
    // gridSize代表宫格数，rows纵向格子数，cols代表横向格子数  如：rows:2 cols:3 代表横向一条线，纵向2条线，6宫格
    switch (gridSize) {
      case 4:
        rows = 2;
        cols = 2;
        break;
      case 6:
        rows = 2;
        cols = 3;
        break;
      case 9:
        rows = 3;
        cols = 3;
        break;
      case 16:
        rows = 4;
        cols = 4;
        break;
      default:
        // 对于非标准宫格尺寸的处理
        const n = Math.sqrt(gridSize);
        rows = Math.floor(n);
        cols = Math.ceil(gridSize / rows);
        break;
    }

    const hor = [];
    const ver = [];

    // 生成横线坐标
    for (let i = 1; i < rows; i++) {
      hor.push((height / rows / scaleFactor) * i);
    }

    // 生成竖线坐标
    for (let i = 1; i < cols; i++) {
      ver.push((width / cols / scaleFactor) * i);
    }

    return { hor, ver };
  };

  // 横向线拖拽
  const horLineDrag = (e, data, index) => {
    const { x, y } = data;
    const { height: boxHeight } = boxStyle;

    let newY = y;

    if (newY < 4) {
      newY = 4;
      message.warning("请距离边界至少2PX距离，已为您设置为4PX");
    }
    if (newY > boxHeight - 4) {
      newY = boxHeight - 4;
      message.warning("请距离边界至少2PX距离，已为您设置为4PX");
    }

    const mapList = cloneDeep(hor);
    mapList[index] = newY;
    setHor(mapList);
  };
  // 纵向线拖拽
  const verLineDrag = (e, data, index) => {
    const { x, y } = data;
    const { width: boxWidth } = boxStyle;

    let newX = x;

    if (newX < 4) {
      newX = 4;
      message.warning("请距离边界至少2PX距离，已为您设置为4PX");
    }
    if (newX > boxWidth - 4) {
      newX = boxWidth - 4;
      message.warning("请距离边界至少2PX距离，已为您设置为4PX");
    }

    const mapList = cloneDeep(ver);
    mapList[index] = newX;
    setVer(mapList);
  };

  const submit = async () => {
    const { width: boxWidth, height: boxHeight } = boxStyle;

    const ratioWidth = boxWidth / state.sizeInfo.scaleFactor; //需要除缩放比例，例如widnows10 分辨率为125% 150%
    const ratioHeight = boxHeight / state.sizeInfo.scaleFactor;

    // console.log(111, ratioWidth, ratioHeight, hor, ver);

    // 根据横竖线计算出left top width height
    const divPositions = calculateDivPositions(hor, ver, ratioWidth, ratioHeight);

    const requestData = divPositions.map((v) => {
      const { left, top, width, height } = v;

      return {
        x: left / ratioWidth,
        y: top / ratioHeight,
        w: width / ratioWidth,
        h: height / ratioHeight,
      };
    });

    // console.log(divPositions, requestData);

    const res = await setBox(requestData);

    if (res) {
      navigate("/config");
    } else {
      message.error("上传区域配置失败，请重试或联系管理员！！！");
    }
  };

  // 根据坐标信息计算出每个div坐标及大小信息
  const calculateDivPositions = (horizontalLines, verticalLines, parentWidth, parentHeight) => {
    const allHorizontalLines = [0, ...horizontalLines, parentHeight];
    const allVerticalLines = [0, ...verticalLines, parentWidth];

    const positions = [];
    for (let i = 0; i < allHorizontalLines.length - 1; i++) {
      for (let j = 0; j < allVerticalLines.length - 1; j++) {
        const left = allVerticalLines[j];
        const top = allHorizontalLines[i];
        const width = allVerticalLines[j + 1] - left;
        const height = allHorizontalLines[i + 1] - top;
        positions.push({ left, top, width, height });
      }
    }
    return positions;
  };

  // 取消
  const goBack = () => {
    navigate("/screenShots");
  };

  return (
    <div className="screen-shots-render">
      <div className="content">
        <div className="img-box">
          <img src={state.imageData} ref={imgRef} alt="" />
          <div className="canvas" ref={canvasRef} style={boxStyle}>
            {hor.map((v, i) => (
              <Draggable
                key={i}
                axis="y"
                bounds="parent"
                position={{ x: 0, y: v }}
                onMouseDown={(e) => e.stopPropagation()}
                onStop={(e, data) => horLineDrag(e, data, i)}
              >
                <p className="hor"></p>
              </Draggable>
            ))}

            {ver.map((v, i) => (
              <Draggable
                key={i}
                axis="x"
                bounds="parent"
                position={{ x: v, y: 0 }}
                onMouseDown={(e) => e.stopPropagation()}
                onStop={(e, data) => verLineDrag(e, data, i)}
              >
                <p key={i} className="ver"></p>
              </Draggable>
            ))}
          </div>
        </div>
      </div>
      <ul className="btn" style={{ left: (state.sizeInfo.width * 0.5) / state.sizeInfo.scaleFactor }}>
        <li onClick={submit}>
          <img className="ok" title="确定" src={okImg} alt="" />
        </li>
        <li onClick={goBack}>
          <img className="cancel" title="取消" src={cancelImg} alt="" />
        </li>
      </ul>
    </div>
  );
};

export default GridScreenShots;
