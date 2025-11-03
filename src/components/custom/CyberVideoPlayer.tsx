"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { APITypes } from "plyr-react";
import "plyr-react/plyr.css";

// 动态导入 Plyr，禁用 SSR
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

interface CyberVideoPlayerProps {
  src: string;
  poster?: string;
  onReady?: (player: APITypes) => void;
}

export function CyberVideoPlayer({
  src,
  poster,
  onReady,
}: CyberVideoPlayerProps) {
  const ref = useRef<APITypes>(null);
  const [isClient, setIsClient] = useState(false);
  const onReadyRef = useRef(onReady);

  // 更新 onReady ref
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // 客户端检测
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Plyr 就绪回调
  useEffect(() => {
    if (ref.current && isClient && onReadyRef.current) {
      onReadyRef.current(ref.current);
    }
  }, [isClient]);

  const videoSrc = {
    type: "video" as const,
    sources: [
      {
        src: src,
        type: "video/mp4" as const,
      },
    ],
    poster: poster,
  };

  const options = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
    autoplay: true,
    muted: true,
    loop: { active: true },
    hideControls: true,
    resetOnEnd: true,
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    settings: ["quality", "speed"],
    quality: {
      default: 1080,
      options: [1080, 720, 480],
    },
    speed: {
      selected: 1,
      options: [0.5, 0.75, 1, 1.25, 1.5, 2],
    },
  };

  if (!isClient) {
    return (
      <div className="cyber-video-player aspect-video bg-cyber-gray-900 flex items-center justify-center">
        <div className="text-cyber-gray-400">Loading player...</div>
      </div>
    );
  }

  return (
    <div className="cyber-video-player">
      <Plyr ref={ref} source={videoSrc} options={options} />
    </div>
  );
}

