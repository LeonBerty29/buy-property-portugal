"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PropertyVideo } from "@/types/property";
import { useTranslations } from "next-intl";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading video...</div>
    </div>
  ),
});

interface PropertyVideoPlayerProps {
  videos: PropertyVideo[];
  className?: string;
  autoPlay?: boolean;
  showPlaylist?: boolean;
}

// Types for ReactPlayer
interface ReactPlayerInstance {
  seekTo: (amount: number, type?: "seconds" | "fraction") => void;
  getCurrentTime: () => number;
  getSecondsLoaded: () => number;
  getDuration: () => number;
  getInternalPlayer: () => HTMLVideoElement | null;
}

interface ProgressState {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

export function PropertyVideoPlayer({
  videos,
  className = "",
  autoPlay = false,
  showPlaylist = true,
}: PropertyVideoPlayerProps) {
  const t = useTranslations("propertyVideoPlayer");

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playerRef = useRef<ReactPlayerInstance>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  const currentVideo = videos[currentVideoIndex];

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const hideControls = () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(
          () => setShowControls(false),
          3000
        );
      };

      const showControlsHandler = () => {
        setShowControls(true);
        hideControls();
      };

      const container = containerRef.current;
      container?.addEventListener("mousemove", showControlsHandler);
      container?.addEventListener("touchstart", showControlsHandler);

      hideControls();

      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        container?.removeEventListener("mousemove", showControlsHandler);
        container?.removeEventListener("touchstart", showControlsHandler);
      };
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
    }
  }, [isFullscreen]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  // Double-click to toggle fullscreen
  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  const handleProgress = (state: ProgressState) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      const target = e.target as HTMLInputElement;
      playerRef.current.seekTo(parseFloat(target.value));
    }
  };

  // Enhanced touch handling for mobile
  const handleSeekTouchStart = () => {
    setSeeking(true);
  };

  const handleSeekTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      const target = e.target as HTMLInputElement;
      playerRef.current.seekTo(parseFloat(target.value));
    }
  };

  // Handle progress bar clicks/taps
  const handleProgressClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (playerRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      setPlayed(percentage);
      playerRef.current.seekTo(percentage);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setMuted(parseFloat(e.target.value) === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setPlayed(0);
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setPlayed(0);
    }
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setPlayed(0);
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">{t("noVideosAvailable")}</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        className={`relative bg-black overflow-hidden shadow-lg ${
          isFullscreen ? "fixed inset-0 z-50" : "rounded-lg"
        }`}
      >
        {/* Video Player */}
        <div
          className={`relative ${
            isFullscreen ? "w-full h-full" : "aspect-video"
          }`}
          onDoubleClick={handleDoubleClick}
        >
          <ReactPlayer
            ref={playerRef}
            url={currentVideo.url}
            width="100%"
            height="100%"
            playing={playing}
            muted={muted}
            volume={volume}
            onProgress={handleProgress}
            onDuration={setDuration}
            onEnded={handleNext}
            controls={false}
            config={{
              file: {
                attributes: {
                  preload: "metadata",
                  playsInline: true,
                },
              },
            }}
          />

          {/* Custom Controls Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            } ${isFullscreen ? "p-4 md:p-6" : "p-2 sm:p-4"}`}
          >
            {/* Progress Bar */}
            <div className={`${isFullscreen ? "mb-4" : "mb-2 sm:mb-3"}`}>
              <input
                ref={progressRef}
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchStart={handleSeekTouchStart}
                onTouchEnd={handleSeekTouchEnd}
                onClick={handleProgressClick}
                className={`w-full appearance-none cursor-pointer bg-white/30 rounded-lg ${
                  isFullscreen ? "h-1" : "h-0.5"
                } progress-slider`}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-blue-400 transition-colors p-1"
                >
                  {playing ? (
                    <Pause size={isFullscreen ? 24 : 18} />
                  ) : (
                    <Play size={isFullscreen ? 24 : 18} />
                  )}
                </button>

                {/* Volume Controls - Show on larger screens or fullscreen */}
                <div
                  className={`${
                    isFullscreen ? "flex" : "hidden sm:flex"
                  } items-center space-x-2`}
                >
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400 transition-colors p-1"
                  >
                    {muted ? (
                      <VolumeX size={isFullscreen ? 24 : 20} />
                    ) : (
                      <Volume2 size={isFullscreen ? 24 : 20} />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className={`bg-white/30 rounded-lg appearance-none cursor-pointer h-1 ${
                      isFullscreen ? "w-24" : "w-16 sm:w-20"
                    }`}
                  />
                </div>

                <div
                  className={`text-white ${
                    isFullscreen ? "text-base" : "text-xs sm:text-sm"
                  }`}
                >
                  {formatTime(played * duration)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Previous/Next buttons - Show on larger screens or fullscreen */}
                {videos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      disabled={currentVideoIndex === 0}
                      className={`${
                        isFullscreen ? "block" : "hidden sm:block"
                      } text-white hover:text-blue-400 disabled:text-gray-500 transition-colors p-1`}
                      title={t("previousVideo")}
                    >
                      <ChevronLeft size={isFullscreen ? 20 : 16} />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentVideoIndex === videos.length - 1}
                      className={`${
                        isFullscreen ? "block" : "hidden sm:block"
                      } text-white hover:text-blue-400 disabled:text-gray-500 transition-colors p-1`}
                      title={t("nextVideo")}
                    >
                      <ChevronRight size={isFullscreen ? 20 : 16} />
                    </button>
                  </>
                )}

                {/* Fullscreen Toggle - Always visible */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors p-1"
                  title={
                    isFullscreen ? t("exitFullscreen") : t("enterFullscreen")
                  }
                >
                  {isFullscreen ? (
                    <Minimize
                      size={isFullscreen ? 24 : 18}
                      className="sm:w-5 sm:h-5"
                    />
                  ) : (
                    <Maximize
                      size={isFullscreen ? 24 : 18}
                      className="sm:w-5 sm:h-5"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Video Title Overlay */}
          <div
            className={`absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3
              className={`text-white font-semibold bg-black/60 px-2 py-1 sm:px-3 rounded backdrop-blur-sm ${
                isFullscreen ? "text-xl" : "text-sm sm:text-lg"
              }`}
            >
              {currentVideo.title}
            </h3>
          </div>

          {/* Mobile fullscreen close button */}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors p-2 bg-black/50 rounded-full sm:hidden"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Video Playlist - Hidden in fullscreen */}
      {showPlaylist && videos.length > 1 && !isFullscreen && (
        <div className="mt-4">
          <h4 className="text-base sm:text-lg font-semibold mb-3">
            {t("propertyVideos")}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {videos.map((video, index) => (
              <button
                key={`${video.id}--${index}`}
                onClick={() => handleVideoSelect(index)}
                className={`relative p-2 sm:p-3 rounded-lg border-2 transition-all text-left ${
                  index === currentVideoIndex
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Play size={14} className="sm:w-4 sm:h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">
                      {video.title}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: ${isFullscreen ? "14px" : "12px"};
          height: ${isFullscreen ? "14px" : "12px"};
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-slider::-moz-range-thumb {
          width: ${isFullscreen ? "14px" : "12px"};
          height: ${isFullscreen ? "14px" : "12px"};
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-slider::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .progress-slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        /* Enhanced mobile touch targets */
        @media (max-width: 640px) {
          .progress-slider::-webkit-slider-thumb {
            width: 14px;
            height: 14px;
            transform: scale(1);
          }
          .progress-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            transform: scale(1);
          }
        }

        /* Touch-friendly progress bar */
        .progress-slider {
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }

        @media (pointer: coarse) {
          .progress-slider {
            padding: 8px 0;
            margin: -8px 0;
          }
        }
      `}</style>
    </div>
  );
}