import React, { forwardRef, useState, useImperativeHandle } from "react";
import { Modal, Steps, Input, Button, Form, Select, Radio, message, Row, Col } from "antd";
const { Option } = Select;
const { Step } = Steps;
import "./add.less";

const Add = (props, ref) => {
  // 使用了forwardRef，事件需抛出给父组件，父组件才可以调用
  useImperativeHandle(ref, () => ({
    getPage,
  }));

  const [open, setOpen] = useState(false); //弹窗是否显示
  const [current, setCurrent] = useState(0); //步骤几
  const [taskId, setTaskId] = useState(null); //是否已创建过任务，即上一步操作
  // first-step
  const [firstForm] = Form.useForm();
  const [taskList, setTaskList] = useState([
    {
      id: 1,
      name: "人员筛查",
    },
  ]);
  // second-step
  const [secondValue, setSecondValue] = useState({
    type: "openDirectory",
    file: "",
    result: "",
  });
  // last-step
  const [lastForm] = Form.useForm();

  // 打开弹窗
  const getPage = () => {
    setOpen(true);
  };
  // 关闭弹窗
  const handleCancel = () => {
    setOpen(false);
  };
  // 第一步
  const next = async () => {
    // if (current === 0) {
    //   const formValidateFields = await firstForm.validateFields();
    //   console.log(formValidateFields);
    //   if (formValidateFields) {
    //   }
    // }
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  // 第二步
  const changeSelectType = (e) => {
    setSecondValue({ ...secondValue, type: e.target.value, file: "", result: "" });
  };
  const selectFile = async () => {
    const res = await window.electronAPI.selectFile(secondValue.type); //选择文件

    if (res) {
      const { canceled, filePaths } = res;

      if (canceled === true) {
        return message.warning("已取消选择");
      }

      setSecondValue({
        ...secondValue,
        file: filePaths.map((v, i) => `${i + 1}、${v}`).join("\n"),
      });
    } else {
      message.error("错误，请重试！！！");
    }
  };
  // 第三步
  const submit = () => {};

  // 各步骤render
  const firstRender = () => {
    return (
      <div className="first-step">
        <Form name="firstStep" form={firstForm} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
          <Form.Item label="任务名称" name="name" rules={[{ required: true, message: "请输入" }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="任务类型" name="type" rules={[{ required: true, message: "请选择" }]}>
            <Select allowClear placeholder="请选择">
              {taskList.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  };
  const secondRender = () => {
    return (
      <div className="second-step">
        <Radio.Group size="large" value={secondValue.type} onChange={changeSelectType}>
          <Radio value="openDirectory">选择目录</Radio>
          <Radio value="openFile">选择文件</Radio>
        </Radio.Group>
        <div className="select-file">
          <p className="select-title">选择视频文件</p>
          <div className="content">
            <Button type="primary" onClick={selectFile}>
              选择{secondValue.type === "openDirectory" ? "目录" : "文件"}
            </Button>
            <Input.TextArea disabled value={secondValue.file} autoSize={{ minRows: 4, maxRows: 4 }} placeholder="选择目录/文件后此处展示路径" />
          </div>
        </div>
        <div className="result-file">
          <p className="result-title">文件检测</p>
          <div className="content">
            <Input.TextArea disabled value={secondValue.result} autoSize={{ minRows: 4, maxRows: 4 }} placeholder="选择目录/文件后此处展示检测结果" />
          </div>
        </div>
      </div>
    );
  };
  const lastRender = () => {
    return (
      <div className="last-step">
        <Form name="lastStep" form={lastForm} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} autoComplete="off">
          <Row gutter={2}>
            <Col span={12}>
              <Form.Item label="性别" name="gender">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>男</Option>
                  <Option value={0}>女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="头发长短" name="hairLength">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>长发</Option>
                  <Option value={0}>短发</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="袖子长短" name="sleeveLength">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>长袖</Option>
                  <Option value={0}>短袖</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下衣长短" name="lowerGarmentLength">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>长</Option>
                  <Option value={0}>短</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下衣类型" name="lowerGarmentType">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>裙子</Option>
                  <Option value={0}>裤子</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否戴帽子" name="wearHat">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否背包" name="wearBackack">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="年龄" name="age">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>儿童</Option>
                  <Option value={2}>青少年</Option>
                  <Option value={3}>成年人</Option>
                  <Option value={4}>老人</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="上衣颜色" name="topColor">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>黑</Option>
                  <Option value={2}>白</Option>
                  <Option value={3}>红</Option>
                  <Option value={4}>紫</Option>
                  <Option value={5}>黄</Option>
                  <Option value={6}>灰</Option>
                  <Option value={7}>蓝</Option>
                  <Option value={8}>绿</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下衣颜色" name="bottomColor">
                <Select allowClear placeholder="请选择">
                  <Option value={1}>黑</Option>
                  <Option value={2}>白</Option>
                  <Option value={3}>红</Option>
                  <Option value={4}>紫</Option>
                  <Option value={5}>黄</Option>
                  <Option value={6}>灰</Option>
                  <Option value={7}>蓝</Option>
                  <Option value={8}>绿</Option>
                  <Option value={9}>蓝</Option>
                  <Option value={10}>棕</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  // 步骤条dom
  const steps = [
    {
      title: "添加分析任务",
      content: firstRender(),
    },
    {
      title: "添加视频文件",
      content: secondRender(),
    },
    {
      title: "配置分析任务",
      content: lastRender(),
    },
  ];

  return (
    <Modal
      className="add"
      title="创建任务"
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
      <Steps current={current}>
        {steps.map((v, i) => (
          <Step key={i} title={v.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>

      <div className="config-btn">
        {current > 0 && <Button onClick={prev}>上一步</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={submit}>
            提交
          </Button>
        )}
      </div>
    </Modal>
  );
};
export default forwardRef(Add);
