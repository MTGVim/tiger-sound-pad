import { PropsWithChildren, useRef } from "react";
import { usePadStore } from "../store/padStore";
import { twMerge } from "tailwind-merge";



const buttonBaseClasses = "flex items-center justify-center w-16 gap-4 h-12 rounded-full shadow-lg border border-gray-500 cursor-pointer transition-colors";

interface TrashButtonProps {
    isActive: boolean;
    onToggle: () => void;
  }
  
  const ButtonLayout: React.FC<PropsWithChildren> = ({children}) => {
    return <div className="flex flex-row gap-3 items-center justify-center fixed top-4 right-4 z-20 h-12">{children}</div>
  }
  
  const TrashButton: React.FC<TrashButtonProps> = ({ isActive, onToggle }) => {
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
  
  const ReorderButton: React.FC<TrashButtonProps> = ({ isActive, onToggle }) => {
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
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="13" x2="20" y2="13" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
    );
  };
  
  const SaveButton: React.FC = () => {
    const {exportToZip} = usePadStore();
    return (<div className={twMerge(buttonBaseClasses," flex-col bg-gray-800 gap-0")} onClick={() => exportToZip()}>
      <div>📦</div>SAVE
      </div>
    );
  }
  
  
  const LoadButton: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {importFromZip} = usePadStore();
    return (<div className={twMerge(buttonBaseClasses," flex-col bg-gray-800 gap-0")} onClick={() => inputRef?.current?.click()}>
      <div>📥</div>LOAD
      <input
        type="file"
        className="hidden"
        accept=".zip"
        ref={inputRef}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) importFromZip(file)
        }}
      />
      </div>
    );
  }

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
    return <ButtonLayout>
      <TrashButton isActive={isDeleteMode} onToggle={onToggleDeleteMode} />
      <ReorderButton isActive={isReorderMode} onToggle={onToggleReorderMode} />
      <SaveButton />
      <LoadButton />
    </ButtonLayout>
  }