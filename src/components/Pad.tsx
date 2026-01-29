import React, { useEffect, useState } from "react";
import type { Pad as PadType } from "../types/pad";
import { useHowlerStore } from "../store/howlerStore";

interface PadProps {
  pad: PadType;
  isDeleteMode: boolean;
  isReorderMode: boolean;
  onDeletePad: (id: string) => void;
}

export const Pad: React.FC<PadProps> = ({
  pad,
  isDeleteMode = false,
  isReorderMode = false,
  onDeletePad,
}) => {
  const playSound = useHowlerStore((state) => state.playSound);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(pad.audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showPulse, setShowPulse] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (pad.audioFile) {
      objectUrl = URL.createObjectURL(pad.audioFile);
      setAudioSrc(objectUrl);
    } else {
      setAudioSrc(pad.audioUrl);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pad.audioFile, pad.audioUrl]);

  // pulse 상태 관리
  useEffect(() => {
    if (isPlaying && !isDeleteMode && !isReorderMode) {
      setShowPulse(true);
      setFadeOut(false);
    } else if (showPulse) {
      setFadeOut(true);
      const timeout = setTimeout(() => setShowPulse(false), 200); // scale + fade 0.2s
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, isDeleteMode, isReorderMode, showPulse]);

  const handleClick = () => {
    if (isDeleteMode) {
      if (window.confirm("선택한 패드를 정말 삭제하시겠습니까?")) {
        onDeletePad(pad.id);
      }
      return;
    }
    if (isReorderMode) return;

    if (audioSrc) {
      setIsPlaying(true);
      playSound(audioSrc, () => setIsPlaying(false)); // 재생 종료 시 isPlaying false
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {showPulse && (
        <div
          className={`
            absolute
            w-[114%] aspect-square
            rounded-full
            bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]
            animate-pulse-scale
            blur-[3px]
            shadow-[0_0_25px_rgba(255,0,255,0.6),0_0_50px_rgba(0,255,255,0.4)]
            transform transition-transform duration-200
            ${fadeOut ? "opacity-0 scale-0" : "opacity-100 scale-100"}
          `}
        />
      )}

      <button
        onClick={handleClick}
        className="
          relative z-10
          rounded-full
          bg-linear-to-br from-zinc-800 to-zinc-900
          text-white
          shadow-[0_6px_12px_rgba(0,0,0,0.45)]
          active:translate-y-[2px] active:scale-[0.98]
          line-clamp-3
          text-center
          w-[140px] max-w-[30vw]
          aspect-square
          break-all
          text-sm
        "
      >
        {pad.label}
      </button>
    </div>
  );
};
