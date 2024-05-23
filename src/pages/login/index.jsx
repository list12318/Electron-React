import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { Form, Input, Button } from "antd";
import { elMessage } from "@/util/message";
import { setSession } from "@/util";
import { login } from "./service";

const Login = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 进入当前页默认设置窗口大小和居中
  useEffect(() => {
    window.electronAPI.setWindowSize({ width: 500, height: 120 }); //修改窗口大小
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
        <div className="login_box">
          <Form form={form} autoComplete="off">
            <Input.Group compact>
              <Form.Item
                name="ip"
                style={{
                  width: "calc(100% - 90px)",
                }}
                rules={[{ required: true, message: "请输入连接IP" }]}
              >
                <Input addonBefore="http://" addonAfter="80" placeholder="IP地址" />
              </Form.Item>
              <Button type="primary" loading={loading} onClick={submit}>
                连接
              </Button>
            </Input.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
