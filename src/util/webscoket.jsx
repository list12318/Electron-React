/*
 * @Author: 李永健
 * @Date: 2023-03-07 14:39:16
 * @LastEditors: 李永健
 * @LastEditTime: 2023-03-08 10:13:23
 * @Description: 封装Websocket自定义Hooks
 */
import { useState, useRef, useEffect } from "react";

const useWebsocket = (url) => {
  const ws = useRef(null);
  const [wsData, setMessage] = useState(null); // socket 数据
  const [readyState, setReadyState] = useState(null); //  socket 状态

  useEffect(() => {
    return () => {
      closeWebSocket(); //关闭ws链接
    };
  }, [ws]);
  // websocket初始化
  const webSocketInit = () => {
    if (!ws.current || ws.current.readyState === 3) {
      creatWebSocket();
    }
  };
  //创建websocket链接
  const creatWebSocket = () => {
    // socket状态码
    const stateArr = [
      { key: 0, value: "正在连接中" },
      { key: 1, value: "已经连接并且可以通讯" },
      { key: 2, value: "连接正在关闭" },
      { key: 3, value: "连接已关闭或者没有连接成功" },
    ];
    try {
      ws.current = new WebSocket(url);
      ws.current.onopen = () => setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onclose = () => setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onerror = () => setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onmessage = (e) => setMessage(e.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 发送数据
  const sendMessage = (str) => ws.current?.send(str);

  //  关闭 WebSocket
  const closeWebSocket = () => {
    ws.current?.close();
    ws.current = null;
  };

  //重连
  const reconnect = () => {
    try {
      closeWebSocket();
      creatWebSocket();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    webSocketInit, //初始化webscoket
    readyState, //当前链接状态
    sendMessage, //发送消息
    wsData, //ws接口返回数据
    closeWebSocket, //关闭ws
    reconnect, //重连
  };
};
export default useWebsocket;
