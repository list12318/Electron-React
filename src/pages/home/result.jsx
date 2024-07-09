import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { Modal, DatePicker, Input, Button, Image, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import "./result.less";
import noState from "@/assets/img/noData.svg";

const Result = (props, ref) => {
  // 使用了forwardRef，事件需抛出给父组件，父组件才可以调用
  useImperativeHandle(ref, () => ({
    getPage,
  }));

  const [open, setOpen] = useState(false); //弹窗是否显示
  const [id, setId] = useState(null);
  const [data, setData] = useState([
    {
      url: "https://img1.baidu.com/it/u=3518673092,2032183538&fm=253&fmt=auto&app=138&f=JPEG?w=781&h=500",
      name: "测试1",
    },
    {
      url: "https://img1.baidu.com/it/u=4049906368,438977941&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
      name: "测试2",
    },
  ]);
  const [search, setSearch] = useState({
    name: "",
    type: "",
    timeClear: null,
    time: [],
  });

  const getPage = (data) => {
    setOpen(true);
    setId(data);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setOpen(false);
  };

  const initData = () => {};

  // 重置
  const reset = () => {
    setSearch({
      name: "",
      type: "",
      time: [],
      timeClear: new Date(),
    });
  };

  return (
    <Modal
      className="result"
      title="分析结果"
      width="70%"
      maskClosable={false}
      keyboard={false}
      style={{
        top: "8%",
      }}
      bodyStyle={{
        height: "calc(90vh - 100px)",
      }}
      visible={open}
      destroyOnClose
      footer={null}
      onCancel={handleCancel}
    >
      <div className="search">
        <div className="left">
          <div className="search-item">
            <p className="title">视频名称：</p>
            <Input
              value={search.name}
              onChange={(e) =>
                setSearchValue({
                  ...search,
                  name: e.target.value,
                })
              }
              allowClear
              placeholder="请输入"
            />
          </div>
          <div className="search-item">
            <p className="title">起止时间：</p>
            <RangePicker
              key={search.timeClear}
              showTime
              placeholder={["开始时间", "结束时间"]}
              onChange={(date, dateString) => setSearch({ ...search, time: date })}
            />
          </div>
        </div>
        <div className="right">
          <Button type="primary" onClick={initData}>
            查询
          </Button>
          <Button onClick={reset}>重置</Button>
        </div>
      </div>
      <ul className="list">
        {data.length ? (
          data.map((v, i) => (
            <li key={i}>
              <Image
                className="img-preview"
                src={v.url}
                preview={{
                  getContainer: () => props.homeRef,
                  mask: (
                    <Tooltip title="查看大图">
                      <EyeOutlined />
                    </Tooltip>
                  ),
                }}
              />

              <p>
                <span>{v.name}</span>
                {v.time}
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
    </Modal>
  );
};
export default forwardRef(Result);
