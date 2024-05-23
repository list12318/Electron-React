import React, { useState, useEffect, useRef } from "react";
import "./index.less";
import "./video-js.css";
import { uuid } from "@/util";
import { Button } from "antd";

const VideoPlayer = (props) => {
  const [videoId, setVideoId] = useState("player" + uuid(8, 10));
  const videoPlayer = useRef(null);
  useEffect(() => {
    // 初始化组件时初始化播放器，id需随机，否则第二次将无法加载播放器
    createPlayer(videoId);
    return () => {
      destroyPlayer(); //组件销毁时清空视频链接与值
    };
  }, []);

  // 创建播放器
  const createPlayer = (videoId) => {
    let videoPlayerCopy = videojs(
      videoId,
      {
        techOrder: ["html5", "native"],
        sources: [
          {
            src: props.videoUrl,
            type: "video/native",
          },
        ],
        playbackRates: [0.5, 1, 1.5, 2],
        poster: props.poster, //视频封面
        // forcesize: true,
        controlBar: {
          pictureInPictureToggle: false,
          currentTimeDisplay: true,
          timeDivider: true,
          durationDisplay: true,
          playbackRateMenuButton: true,
          remainingTimeDisplay: false,
          volumePanel: { inline: false },
        },
      },
      function onPlayerReady() {
        // console.log("Your player is ready!");

        this.on("loadstart", () => {
          // console.log("开始请求数据 ");
          props.loadstart && props.loadstart();
        });
        this.on("progress", () => {
          // console.log("正在请求数据 ");
          props.progress && props.progress();
        });
        this.on("waiting", () => {
          // console.log("等待数据");
          props.waiting && props.waiting();
        });
        this.on("play", () => {
          // console.log("视频开始播放");
          props.play && props.play();
        });
        this.on("playing", () => {
          // console.log("视频播放中");
          props.playing && props.playing();
        });
        this.on("pause", () => {
          // console.log("视频暂停播放");
          props.pause && props.pause();
        });
        this.on("ended", () => {
          // console.log("视频播放结束");
          props.ended && props.ended();
        });
        this.on("error", () => {
          // console.log("加载错误");
          props.error && props.error();
        });
        this.on("seeking", () => {
          // console.log("视频跳转中");
          props.seeking && props.seeking();
        });
        this.on("seeked", () => {
          // console.log("视频跳转结束");
          props.seeked && props.seeked();
        });
        this.on("ratechange", () => {
          // console.log("播放速率改变");
          props.ratechange && props.ratechange();
        });
        this.on("timeupdate", () => {
          // console.log("播放时长改变");
          const currentTime = this.techGet_("currentTime"); //获取当前播放到第几秒了
          props.timeupdate && props.timeupdate(currentTime);
        });
        this.on("volumechange", () => {
          // console.log("音量改变");
          props.volumechange && props.volumechange();
        });
      }
    );
    // 保存实例
    videoPlayer.current = videoPlayerCopy;
  };
  // 销毁播放器
  const destroyPlayer = () => {
    videoPlayer.current.dispose();
    videoPlayer.current = null;
    setVideoId(null);
  };
  return (
    <div className="video-player">
      <video id={videoId} className="video-js vjs-big-play-centered vjs-playback-rate" controls></video>
    </div>
  );
};

export default VideoPlayer;
