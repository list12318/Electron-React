import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Table, Button, message, Tooltip, Select, Image } from "antd";
const { Option } = Select;
import { EyeOutlined } from "@ant-design/icons";
import "./index.less";
import noState from "@/assets/img/noData.svg";
import Add from "./add";
import Result from "./result";
import { pageList } from "./service";

const Login = () => {
  // ref
  const timerRef = useRef(null);
  const homeRef = useRef(null);
  const tableRef = useRef(null);
  const addRef = useRef(null);
  const resultRef = useRef(null);
  // state
  const [table, setTable] = useState({
    columns: [
      {
        title: "任务名称",
        dataIndex: "taskName",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: "进度",
        dataIndex: "schedule",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: "创建人",
        dataIndex: "founder",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        ellipsis: { showTitle: false },
        render: (record) => (
          <Tooltip placement="top" title={record}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: "操作",
        key: "action",
        width: 290,
        render: (_, record) => {
          return (
            <>
              <Button type="link" onClick={() => itemStart(record)}>
                启动
              </Button>
              <Button type="link" onClick={() => itemPause(record)}>
                暂停
              </Button>
              <Button type="link" onClick={() => itemEnd(record)}>
                结束
              </Button>
              <Button type="link" onClick={() => itemTop(record)}>
                上移
              </Button>
              <Button type="link" onClick={() => itemBottom(record)}>
                下移
              </Button>
              <Button type="link" onClick={() => itemResult(record)}>
                查看结果
              </Button>
            </>
          );
        },
      },
    ],
    data: [{ id: 1, taskName: "哈哈" }],
    current: 1,
    total: 0,
    loading: false,
  });
  const [tableHeight, setTableHeight] = useState(0);

  const [alarm, setAlarm] = useState([]);
  const [list, setList] = useState([
    {
      url: "https://img1.baidu.com/it/u=3518673092,2032183538&fm=253&fmt=auto&app=138&f=JPEG?w=781&h=500",
      name: "测试1",
      type: "离开区域",
      id: 1,
    },
    {
      url: "https://img1.baidu.com/it/u=4049906368,438977941&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
      name: "测试2",
      type: "物品遗留",
      id: 2,
    },
  ]);

  useLayoutEffect(() => {
    setTableHeight(tableRef.current.offsetHeight - 64 - 55); //设置table最大滚动高度，64为分页，55为表头
  }, []);

  useEffect(() => {
    // 接收来自electron的消息
    window.electronAPI.windowResize((data) => {
      if (tableRef && tableRef.current) {
        setTableHeight(tableRef.current.offsetHeight - 64 - 55);
      }
    });

    if (!timerRef.current) {
      //1s轮询查分页
      timerRef.current = setInterval(() => {
        // initData();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  useEffect(() => {
    // initData();
  }, [table.current, table.size]);

  const pageChange = (pageNum, pageSize) => {
    setTable({
      ...table,
      current: pageNum,
    });
  };

  const initData = async () => {
    console.log(1111);
    return;

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

  const add = () => {
    addRef.current.getPage();
  };
  const pause = async () => {};
  const stop = async () => {};

  // 表格操作
  const itemStart = () => {};
  const itemPause = () => {};
  const itemEnd = () => {};
  const itemTop = () => {};
  const itemBottom = () => {};
  const itemResult = (item) => {
    resultRef.current.getPage(item);
  };

  const initList = (value) => {};

  return (
    <>
      <div className="home" ref={homeRef}>
        <div className="left">
          <div className="search">
            <Button type="primary" onClick={add}>
              创建任务
            </Button>
            <Button type="primary" onClick={pause}>
              暂停任务
            </Button>
            <Button type="primary" onClick={stop}>
              结束任务
            </Button>
          </div>
          <div className="table" ref={tableRef}>
            <Table
              rowKey="id"
              bordered
              columns={table.columns}
              dataSource={table.data}
              loading={table.loading}
              style={{ height: tableHeight + 55 }}
              scroll={{ y: tableHeight }}
              pagination={{
                showSizeChanger: false,
                current: table.current,
                size: 10,
                total: table.total,
                showTotal: () => <span>共 {table.total} 条</span>,
                onChange: pageChange,
              }}
            />
          </div>
        </div>
        <div className="right">
          <p className="title">实时告警列表</p>
          <div className="input-type">
            <Select
              className="first-change"
              allowClear
              placeholder="请选择"
              onChange={(e) => {
                console.log(e);
                // initList(e)
              }}
            >
              <Option value={1}>任务名称</Option>
              <Option value={2}>任务类型</Option>
              <Option value={3}>文件名称</Option>
              <Option value={4}>结果类型</Option>
            </Select>
            <Select className="last-change" allowClear showSearch placeholder="请选择" onChange={(e) => initList(e)}>
              {alarm.map((v) => (
                <Option key={v.value} value={v.value} label={v.label}>
                  {v.label}
                </Option>
              ))}
            </Select>
          </div>
          <ul className="list">
            {list.length ? (
              list.map((v, i) => (
                <li key={i}>
                  <Image
                    className="img-preview"
                    src={v.url}
                    preview={{
                      getContainer: () => homeRef.current,
                      mask: (
                        <Tooltip title="查看大图">
                          <EyeOutlined />
                        </Tooltip>
                      ),
                    }}
                  />
                  <p>
                    <span>{v.name}</span>类型：{v.type}
                  </p>
                </li>
              ))
            ) : (
              <div className="no-data">
                <img src={noState} alt="" />
                <p>暂无数据</p>
              </div>
            )}
          </ul>
        </div>
      </div>
      <Add ref={addRef}></Add>
      <Result ref={resultRef} homeRef={homeRef.current}></Result>
    </>
  );
};

export default Login;
