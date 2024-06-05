import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "./index.less";
import loginLogo from "@/assets/img/login/login_logo.png";
import loginUser from "@/assets/img/login/login_user.png";
import loginPassword from "@/assets/img/login/login_password.png";
import { setSession } from "@/util";
import { login } from "./service";

const Login = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 进入当前页默认设置窗口大小和居中
  useEffect(() => {
    // window.electronAPI.setWindowSize({ width: 500, height: 120 }); //修改窗口大小
    window.electronAPI.setWindowCenter(); //修改窗口居中
    window.electronAPI.setWindowTop(false); //修改窗口层级不置顶
    window.electronAPI.setWindowOpacity({ opacity: 1 }); //修改窗口透明度
  }, []);

  const submit = async () => {
    const formValidateFields = await form.validateFields();
    if (formValidateFields) {
      setLoading(true);

      setSession({
        key: "ip",
        value: `http://${formValidateFields.ip}:80`,
      });

      const res = await login({});

      if (res) {
        navigate("/screenShots");
      } else {
        form.setFields([
          {
            name: "ip",
            errors: ["抱歉，连接失败，请重试或检查IP地址是否正确！！！"],
          },
        ]);

        setLoading(false);
      }
    }
  };

  return (
    <div className="login">
      <div className="login_container">
        <img className="login_logo" src={loginLogo} alt="" />
        <div className="title"> 欢迎使用千眼系统</div>
        <div className="login_box">
          <Form form={form} onFinish={submit} autoComplete="off">
            <Form.Item name="userName" rules={[{ required: true, message: "请输入用户名" }]}>
              <Input placeholder="用户名" prefix={<img src={loginUser} />} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
              <Input.Password placeholder="密码" prefix={<img src={loginPassword} />} />
            </Form.Item>

            <Form.Item name="ip" rules={[{ required: true, message: "请输入连接IP" }]}>
              <Input addonBefore="http://" addonAfter="80" placeholder="IP地址" />
            </Form.Item>

            <Form.Item className="submit">
              <Button type="primary" htmlType="submit" loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
