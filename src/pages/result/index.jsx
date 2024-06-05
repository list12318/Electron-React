import React, { useState, useRef, useEffect } from "react";
import { Button, Table, message, Tooltip, Image } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.less";

import { uuid, getSession } from "@/util";
import useStore from "@/store";
import { getMessageList } from "./service";

const Result = () => {
  const { titleStore } = useStore(); //mobx
  // ref
  const tableRef = useRef(null);
  // state
  const [table, setTable] = useState({
    columns: [
      {
        title: "姓名",
        dataIndex: "name",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: "人脸图片",
        dataIndex: "pic",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Image
            className="img-preview"
            src={record}
            preview={{
              mask: (
                <Tooltip title="查看大图">
                  <EyeOutlined />
                </Tooltip>
              ),
            }}
          />
        ),
      },

      {
        title: "时间",
        dataIndex: "time",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
    ],
    data: [],
    loading: false,
  });

  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    window.electronAPI.setWindowSize({ width: 800, height: 600 }); //修改窗口大小
    window.electronAPI.setWindowTop(false); //修改窗口层级不置顶
    window.electronAPI.setWindowCenter(); //设置窗口居中
    window.electronAPI.setWindowOpacity({ opacity: 1 }); //修改窗口透明度
    window.electronAPI.trayFlicker(false); //取消托盘闪烁

    titleStore.setShow(true);
  }, []);

  useEffect(() => {
    // 接收来自electron的消息
    window.electronAPI.windowResize((data) => {
      // console.log("窗口大小变了哟");
      if (tableRef && tableRef.current) {
        setTableHeight(tableRef.current.offsetHeight - 55);
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    initData();
  }, [table.current, table.size]);

  const initData = async () => {
    setTable({
      ...table,
      loading: true,
    });
    const res = await getMessageList();
    if (res) {
      setTable({
        ...table,
        data: res.map((v) => {
          return {
            ...v,
            id: uuid(8, 10),
            pic: process.env.NODE_ENV === "development" ? v.pic : `${getSession("ip")}${v.pic}`,
          };
        }),
        loading: false,
      });
    } else {
      message.error("查询失败，请重试！！！");
    }
  };
  const search = () => {
    initData();
  };

  return (
    <div className="result">
      <p className="title">
        <span>分析结果</span>
      </p>
      <div className="search">
        <Button type="primary" icon={<SearchOutlined />} onClick={search}>
          查询
        </Button>
      </div>
      <div className="table" ref={tableRef}>
        <Table rowKey="id" bordered columns={table.columns} dataSource={table.data} loading={table.loading} scroll={{ y: tableHeight }} pagination={false} />
      </div>
    </div>
  );
};

export default Result;
