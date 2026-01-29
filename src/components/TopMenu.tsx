import { PropsWithChildren, useRef, useState } from "react";
import { usePadStore } from "../store/padStore";
import { twMerge } from "tailwind-merge";
import { useHowlerStore } from "../store/howlerStore";

const buttonBaseClasses =
  "flex items-center justify-center w-16 gap-4 h-12 rounded-full shadow-lg border border-gray-500 cursor-pointer transition-colors";

interface ToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

const ButtonLayout: React.FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-row flex-wrap gap-3 items-center justify-center min-h-12 mt-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

const VolumeControl: React.FC = () => {
  const { volume, setVolume } = useHowlerStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={twMerge(buttonBaseClasses, "bg-gray-800 flex-col gap-0")}
        title="마스터 볼륨"
      >
        <div>{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</div>
        {Math.round(volume * 100)}%
      </button>

      {/* 슬라이더 */}
      {open && (
        <div
          className="
            absolute top-14 left-1/2 -translate-x-1/2
            bg-gray-800 border border-gray-600
            rounded-xl p-3 shadow-xl
          "
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="
              h-32 w-2
              appearance-none
              bg-transparent
              [writing-mode:vertical-rl]
              rotate-180
              accent-emerald-400
            "
          />
        </div>
      )}
    </div>
  );
};

const TrashButton: React.FC<ToggleButtonProps> = ({ isActive, onToggle }) => {
  const colorClasses = isActive ? " bg-red-600" : " bg-gray-800";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={buttonBaseClasses + colorClasses}
      aria-pressed={isActive}
      aria-label="Delete pads"
      title={isActive ? "삭제 모드 해제" : "삭제 모드 활성화"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-white"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
      </svg>
    </button>
  );
};

const ReorderButton: React.FC<ToggleButtonProps> = ({ isActive, onToggle }) => {
  const colorClasses = isActive ? " bg-green-600" : " bg-gray-800";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={buttonBaseClasses + colorClasses}
      aria-pressed={isActive}
      aria-label="Delete pads"
      title={isActive ? "배치모드" : "배치모드 해제"}
    >
      drag mode
    </button>
  );
};

const SaveButton: React.FC = () => {
  const { exportToZip } = usePadStore();
  return (
    <div
      className={twMerge(buttonBaseClasses, " flex-col bg-gray-800 gap-0")}
      onClick={() => exportToZip()}
    >
      <div>📦</div>SAVE
    </div>
  );
};

const LoadButton: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { importFromZip } = usePadStore();
  return (
    <div
      className={twMerge(buttonBaseClasses, " flex-col bg-gray-800 gap-0")}
      onClick={() => inputRef?.current?.click()}
    >
      <div>📥</div>LOAD
      <input
        type="file"
        className="hidden"
        accept=".zip"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) importFromZip(file);
        }}
      />
    </div>
  );
};

const StopButton: React.FC = () => {
  const { stopSound } = useHowlerStore();
  return (
    <div
      className={twMerge(buttonBaseClasses, " flex-col bg-gray-800 gap-0")}
      onClick={() => stopSound()}
    >
      <div>⏹️</div>STOP!
    </div>
  );
};

export const TopMenu = ({
  isDeleteMode,
  isReorderMode,
  onToggleDeleteMode,
  onToggleReorderMode,
}: {
  isDeleteMode: boolean;
  onToggleDeleteMode: () => void;
  isReorderMode: boolean;
  onToggleReorderMode: () => void;
}) => {
  return (
    <div className="sticky top-0 py-4 z-20 w-full px-4 h-auto pt-4 bg-gray-900">
      <ButtonLayout>
        <VolumeControl />
        <SaveButton />
        <LoadButton />
        <TrashButton isActive={isDeleteMode} onToggle={onToggleDeleteMode} />
        <ReorderButton
          isActive={isReorderMode}
          onToggle={onToggleReorderMode}
        />
      </ButtonLayout>
      <ButtonLayout className="mt-8">
        <StopButton />
      </ButtonLayout>
    </div>
  );
};
