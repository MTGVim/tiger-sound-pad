import React, { useEffect, useState } from "react";
import type { Pad as PadType } from "../types/pad";
import { useHowlerStore } from "../store/howlerStore";

interface PadProps {
  pad: PadType;
  isDeleteMode?: boolean;
  onDeletePad?: (id: string) => void;
}

export const Pad: React.FC<PadProps> = ({
  pad,
  isDeleteMode = false,
  onDeletePad,
}) => {
  const playSound = useHowlerStore((state) => state.playSound);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(pad.audioUrl);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (pad.audioFile) {
      objectUrl = URL.createObjectURL(pad.audioFile);
      setAudioSrc(objectUrl);
    } else {
      setAudioSrc(pad.audioUrl);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pad.audioFile, pad.audioUrl]);

  const handleClick = () => {
    if (isDeleteMode) {
      const confirmed = window.confirm(
        "선택한 패드를 정말 삭제하시겠습니까?"
      );
      if (confirmed && onDeletePad) {
        onDeletePad(pad.id);
      }
      return;
    }

    if (audioSrc) {
      playSound(audioSrc);
    }
  };

  const baseClasses =
    "flex items-center justify-center rounded-lg shadow-md transition-all duration-150";
  const colorClasses = isDeleteMode
    ? "bg-red-700 text-white hover:bg-red-600 active:bg-red-800"
    : "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800";

  return (
    <button
      className={`${baseClasses} ${colorClasses}`}
      style={{ width: pad.width, height: pad.height }}
      onClick={handleClick}
    >
      {pad.label && <span>{pad.label}</span>}
      {pad.iconUrl && (
        <img
          src={pad.iconUrl}
          alt={pad.label || "pad icon"}
          className="w-8 h-8"
        />
      )}
    </button>
  );
};

