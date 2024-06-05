import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Select, Button, InputNumber, Row, Col, Switch, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

import useStore from "@/store";
import "./index.less";
import { cloneDeep } from "lodash";
import { getSession } from "@/util";
import { getConfigService, setAlgorithmService, startAnalysisRes, uploadUser } from "./service";

const Config = () => {
  const navigate = useNavigate();

  const { titleStore } = useStore(); //mobx

  const [algorithm, setAlgorithm] = useState();
  const [options, setOptions] = useState([
    {
      id: 1,
      name: "人员布控",
    },
  ]);
  const [config, setConfig] = useState({
    faceMinWidth: null,
    faceMinHeight: null,
    faceDetectMinScore: null,
    faceRecognizeMinScore: null,
    useSmallFace: false,
  });
  const [uploading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isAnalysis, setIsAnalysis] = useState(false);

  useEffect(() => {
    window.electronAPI.setFullScreen(false); //取消全屏
    window.electronAPI.setWindowSize({ width: 880, height: 550 }); //修改窗口大小
    window.electronAPI.setWindowTop(false); //修改窗口层级不置顶
    window.electronAPI.setWindowCenter(); //设置窗口居中
    window.electronAPI.setWindowOpacity({ opacity: 1 }); //修改窗口透明度

    titleStore.setShow(true);

    // 查默认的配置输入框值
    getConfig();
  }, []);

  const getConfig = async () => {
    const res = await getConfigService();
    if (res) {
      setConfig(res);
    } else {
      message.error("查询默认配置失败！！！");
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpg" || file.type === "image/png" || file.type === "image/jpeg";
    if (!isJpgOrPng) {
      message.error("仅支持JPEG/PNG/JPG格式图片!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小请小于2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = async (info) => {
    const { file } = info;
    // 文件上传
    uploadFile(file);
  };

  // 文件上传
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await uploadUser(formData);

    if (res) {
      getBase64(file, (url) => {
        setUploadLoading(false);
        setImageUrl(url);
      });
    } else {
      message.error("上传失败，请重试！！！");
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // 开始分析
  const start = async () => {
    const requestData = cloneDeep(config);
    // console.log(111, requestData);

    // 保存配置
    const res = await setAlgorithmService(requestData);
    if (!res) {
      return message.error("配置保存失败，请重试！！！");
    }

    const analysisRes = await startAnalysisRes();

    if (analysisRes) {
      navigate("/search"); //跳转开始轮询
    } else {
      message.error("请求失败，请重试！！！");
    }
  };

  const uploadConfig = {
    name: "image",
    listType: "picture-card",
    accept: ".png,.jpg,.jpeg",
    showUploadList: false,
    beforeUpload: (file) => {
      beforeUpload(file);
      return false;
    },
    onChange: (info) => {
      handleChange(info);
    },
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: "4px" }}>上传</div>
    </div>
  );

  return (
    <div className="config">
      <div className="config-box">
        <div className="algorithm">
          <p>算法选择</p>
          <div className="content">
            <Select
              allowClear
              placeholder="请选择"
              value={algorithm}
              onChange={(value) => {
                setAlgorithm(value);
              }}
            >
              {options.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {algorithm && (
          <>
            <div className="user">
              <p>添加布控人员</p>
              <div className="content">
                <Upload {...uploadConfig}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
            </div>
            <div className="config-config">
              <p>配置</p>
              <div className="content">
                <Row gutter="10">
                  <Col span={12}>
                    <span className="title">识别人脸最小宽度：</span>
                    <InputNumber
                      min={1}
                      formatter={(value) => `${value}`.replace(/\D/g, "")}
                      value={config.faceMinWidth}
                      onChange={(value) => setConfig({ ...config, faceMinWidth: value })}
                      placeholder="正整数"
                    ></InputNumber>
                  </Col>
                  <Col span={12}>
                    <span className="title">识别人脸最小高度：</span>
                    <InputNumber
                      min={1}
                      formatter={(value) => `${value}`.replace(/\D/g, "")}
                      value={config.faceMinHeight}
                      onChange={(value) => setConfig({ ...config, faceMinHeight: value })}
                      placeholder="正整数"
                    ></InputNumber>
                  </Col>
                  <Col span={12}>
                    <span className="title">人脸检测相似度最小值：</span>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.1}
                      formatter={(value) => value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")}
                      parser={(value) => value.replace(/[^\d.]/g, "")}
                      value={config.faceDetectMinScore}
                      onChange={(value) => setConfig({ ...config, faceDetectMinScore: value })}
                      placeholder="0-1小数，越大越相似"
                    ></InputNumber>
                  </Col>
                  <Col span={12}>
                    <span className="title">人脸识别相似度最小值：</span>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.1}
                      formatter={(value) => value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")}
                      parser={(value) => value.replace(/[^\d.]/g, "")}
                      value={config.faceRecognizeMinScore}
                      onChange={(value) => setConfig({ ...config, faceRecognizeMinScore: value })}
                      placeholder="0-1小数，越大越相似"
                    ></InputNumber>
                  </Col>
                  <Col span={12}>
                    <span className="title">启用小目标检测：</span>
                    <Switch checked={config.useSmallFace} onChange={(value) => setConfig({ ...config, useSmallFace: value })} />
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="submit">
        {!isAnalysis && (
          <Button type="primary" size="large" onClick={start}>
            启动分析
          </Button>
        )}
      </div>
    </div>
  );
};

export default Config;
